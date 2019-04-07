import pr from "path-to-regexp";
import { tryCatch, Option } from "fp-ts/lib/Option";
import { Params } from "./types/Params";

/**
 * Create pretty path
 *
 * @export
 * @param {string} pattern
 * @param {Params} params
 * @returns {Option<string>}
 */
export function generateAsPath(
  pattern: string,
  params: Params
): Option<string> {
  return tryCatch(() => {
    const toPath = pr.compile(pattern);
    const asPath = toPath(params);

    return asPath;
  });
}
