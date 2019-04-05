import * as t from "io-ts";

export type OptionalT<Q extends t.Props, QO extends t.Props> = t.TypeOf<
  t.IntersectionC<[t.TypeC<Q>, t.PartialC<QO>]>
>;
