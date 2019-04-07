import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";
import { RouteSpec } from "./Route";

/**
 * Route API with Query description
 */
export type RouteQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RouteQSpec<RequiredQuery, OptionalQuery> & {
  linkTo: (q: OptionalT<RequiredQuery, OptionalQuery>, hash?: string) => AsHref;
  Match: React.SFC<{
    children: (
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};

/**
 * Extend RouteSpec to define .query
 */
export type RouteQSpec<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = {
  query: t.IntersectionC<[t.TypeC<RequiredQuery>, t.PartialC<OptionalQuery>]>;
} & RouteSpec;
