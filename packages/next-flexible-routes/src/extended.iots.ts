import * as iots from "io-ts";

/**
 * Utilities to construct runtime types, used for .params & .query
 */
export const T = {
  optional: <Optional extends iots.Props>(p: Optional) =>
    iots.intersection([iots.type({}), iots.partial(p)]),
  required: <Required extends iots.Props>(p: Required) =>
    iots.intersection([iots.type(p), iots.partial({})]),
  both: <Required extends iots.Props, Optional extends iots.Props>(
    r: Required,
    o: Optional
  ) => iots.intersection([iots.type(r), iots.partial(o)])
};
