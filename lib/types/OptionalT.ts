import * as t from "io-ts";

export type IntersectionType<
  Q extends t.Props,
  QO extends t.Props
> = t.IntersectionC<[t.TypeC<Q>, t.PartialC<QO>]>;

export type OptionalT<Q extends t.Props, QO extends t.Props> = t.TypeOf<
  IntersectionType<Q, QO>
>;
