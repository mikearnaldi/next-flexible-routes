import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";
import { RouteSpec } from "./Route";

/**
 * Route API with Params and Query description
 */
export type RoutePQ<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props,
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RoutePQSpec<
  RequiredParams,
  OptionalParams,
  RequiredQuery,
  OptionalQuery
> & {
  linkTo: (
    p: OptionalT<RequiredParams, OptionalParams>,
    q: OptionalT<RequiredQuery, OptionalQuery>,
    hash?: string
  ) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>,
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};

/**
 * Extend RouteSpec to define .params and .query
 */
export type RoutePQSpec<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props,
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = {
  params: t.IntersectionC<
    [t.TypeC<RequiredParams>, t.PartialC<OptionalParams>]
  >;
  query: t.IntersectionC<[t.TypeC<RequiredQuery>, t.PartialC<OptionalQuery>]>;
} & RouteSpec;
