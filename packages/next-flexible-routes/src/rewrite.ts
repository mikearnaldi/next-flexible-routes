import pr, { Key } from "path-to-regexp";
import L from "lodash";
import { Option, fromNullable, option, tryCatch } from "fp-ts/lib/Option";
import { Do } from "fp-ts-contrib/lib/Do";
import { Params } from "./types/Params";
import { RouteSpec } from "./types/Route";

type Keys = { keys: Key[] };
type PathRegex = { path: RegExp };

/**
 * Create Matcher from pattern
 *
 * @param {string} pattern
 * @returns {(Option<PathRegex & Keys>)}
 */
function createMatcher(pattern: string): Option<PathRegex & Keys> {
  return tryCatch(() => {
    const keys: Key[] = [];
    const path = pr(pattern, keys);

    return { keys, path };
  });
}

/**
 * Perform match and wrap result into an option
 * url sanitized of query string
 *
 * @param {string} url
 * @param {PathRegex} regex
 * @returns {Option<string[]>}
 */
function performMatching(url: string, regex: PathRegex): Option<string[]> {
  return fromNullable(regex.path.exec(url.split("?")[0]));
}

/**
 * Extract parameters from match result and zip with keys
 * Obtaining a key value map (Params)
 *
 * @param {((string | undefined)[])} matched
 * @param {Key[]} keys
 * @returns {Option<Params>}
 */
function extractParameters(
  matched: (string | undefined)[],
  keys: Key[]
): Option<Params> {
  return tryCatch(() =>
    L.zipObject(L.map(keys, k => k.name), L.drop(matched, 1))
  );
}

/**
 * Input for calculateUrl
 */

type CalculateUrl = {
  original: string | undefined;
  page: string;
  params: Params;
  query: Params;
};

/**
 * Calculate url for internal representation
 *
 * @export
 * @param {CalculateUrl} {
 *   original,
 *   page,
 *   params,
 *   query
 * }
 * @returns {string}
 */
export function calculateUrl({
  original,
  page,
  params,
  query
}: CalculateUrl): string {
  return [
    `/${page}?`,
    [
      `params=${encodeURIComponent(JSON.stringify(params))}`,
      `original=${original && encodeURIComponent(original)}`,
      `query=${encodeURIComponent(JSON.stringify(query))}`
    ].join("&")
  ].join("");
}

/**
 * Perform matching of url with pattern
 *
 * @export
 * @param {string} url
 * @param {string} pattern
 * @returns {(Option<{
 *   values: (string | undefined)[];
 *   keys: Key[];
 * }>)}
 */
export function matchOrNone(
  url: string,
  pattern: string
): Option<{
  values: (string | undefined)[];
  keys: Key[];
}> {
  return Do(option)
    .bindL("matcher", _ => createMatcher(pattern))
    .bindL("matches", s => performMatching(url, s.matcher))
    .return(s => ({
      values: s.matches.map(m => (m ? decodeURIComponent(m) : undefined)),
      keys: s.matcher.keys
    }));
}

/**
 * Rewrite url if necessary returning an option
 *
 * @param {string} url
 * @param {RouteSpec} { pattern, page }
 * @param {Params} query
 * @returns {Option<string>}
 */
function rewriteOrNone(
  url: string,
  { pattern, page }: RouteSpec,
  query: Params
): Option<string> {
  return Do(option)
    .bindL("result", _ => matchOrNone(url.split("?")[0], pattern))
    .bindL("params", s => extractParameters(s.result.values, s.result.keys))
    .return(s =>
      calculateUrl({
        original: url,
        page,
        params: s.params,
        query
      })
    );
}

export default rewriteOrNone;
