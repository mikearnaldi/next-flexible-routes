import pr, { Key } from "path-to-regexp";
import L from "lodash";
import { Option, fromNullable, option, tryCatch } from "fp-ts/lib/Option";
import { Do } from "fp-ts-contrib/lib/Do";
import { Function1, Function2, Function3 } from "fp-ts/lib/function";
import { Params } from "./types/Params";
import { RouteSpec } from "./types/Route";

type Keys = { keys: Key[] };
type PathRegex = { path: RegExp };

const createMatcher: Function1<string, Option<PathRegex & Keys>> = pattern =>
  tryCatch(() => {
    const keys: Key[] = [];
    const path = pr(pattern, keys);

    return { keys, path };
  });

const performMatching: Function2<string, PathRegex, Option<string[]>> = (
  url,
  regex
) => fromNullable(regex.path.exec(url.split("?")[0]));

const extractParameters: Function2<
  (string | undefined)[],
  Key[],
  Option<Params>
> = (matched, keys) =>
  tryCatch(() =>
    // prettier-ignore
    L.zipObject(
      L.map(keys, k => k.name), 
      L.drop(matched, 1)
    )
  );

type CalculateUrl = {
  original: string | undefined;
  page: string;
  params: Params;
  query: Params;
};

export const calculateUrl: Function1<CalculateUrl, string> = ({
  original,
  page,
  params,
  query
}) =>
  [
    `/${page}?`,
    [
      `params=${encodeURIComponent(JSON.stringify(params))}`,
      `original=${original && encodeURIComponent(original)}`,
      `query=${encodeURIComponent(JSON.stringify(query))}`
    ].join("&")
  ].join("");

export const matchOrNone: Function2<
  string,
  string,
  Option<{
    values: (string | undefined)[];
    keys: Key[];
  }>
> = (url, pattern) =>
  // prettier-ignore
  Do(option)
    .bindL("matcher", _ => createMatcher(pattern))
    .bindL("matches", s => performMatching(url, s.matcher))
    .return(s => ({
      values: s.matches.map(m => m ? decodeURIComponent(m) : undefined),
      keys: s.matcher.keys
    }));

const rewriteOrNone: Function3<string, RouteSpec, Params, Option<string>> = (
  url,
  { pattern, page },
  query
) =>
  // prettier-ignore
  Do(option)
    .bindL("result", _ => matchOrNone(url.split('?')[0], pattern))
    .bindL("params", s => extractParameters(s.result.values, s.result.keys))
    .return(s => calculateUrl({
      original: url, 
      page,
      params: s.params,
      query
    }));

export default rewriteOrNone;
