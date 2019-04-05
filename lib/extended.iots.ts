import * as iots from "io-ts";

export const T = {
  optional: <PO extends iots.Props>(p: PO) =>
    iots.intersection([iots.type({}), iots.partial(p)]),
  required: <P extends iots.Props>(p: P) =>
    iots.intersection([iots.type(p), iots.partial({})]),
  both: <P extends iots.Props, PO extends iots.Props>(r: P, o: PO) =>
    iots.intersection([iots.type(r), iots.partial(o)])
};
