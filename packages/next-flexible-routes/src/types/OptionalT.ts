import * as t from "io-ts";

/**
 * Generic Intersection between required and optional parameters
 * used to describe .params and .query
 */
export type IntersectionType<
  Required extends t.Props,
  Optional extends t.Props
> = t.IntersectionC<[t.TypeC<Required>, t.PartialC<Optional>]>;

/**
 * Generic Type of an Intersection, represents real type
 */
export type OptionalT<
  Required extends t.Props,
  Optional extends t.Props
> = t.TypeOf<IntersectionType<Required, Optional>>;
