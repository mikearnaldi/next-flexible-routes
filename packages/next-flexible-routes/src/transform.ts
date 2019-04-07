import pr from "path-to-regexp";
import { Function2 } from "fp-ts/lib/function";
import { tryCatch, Option } from "fp-ts/lib/Option";
import { Params } from "./types/Params";

export const generateAsPath: Function2<string, Params, Option<string>> = (
  pattern,
  params
) =>
  tryCatch(() => {
    const toPath = pr.compile(pattern);
    const asPath = toPath(params);

    return asPath;
  });
