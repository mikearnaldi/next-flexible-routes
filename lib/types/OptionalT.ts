import * as t from "io-ts";

export type IntersectionType<
  Required extends t.Props,
  Optional extends t.Props
> = t.IntersectionC<[t.TypeC<Required>, t.PartialC<Optional>]>;

export type OptionalT<
  Required extends t.Props,
  Optional extends t.Props
> = t.TypeOf<IntersectionType<Required, Optional>>;
