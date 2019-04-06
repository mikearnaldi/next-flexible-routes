import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";
import { RouteSpec } from "./Route";

export type RouteQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RouteQSpec<RequiredQuery, OptionalQuery> & {
  linkTo: (q: OptionalT<RequiredQuery, OptionalQuery>) => AsHref;
  Match: React.SFC<{
    children: (
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};

export type RouteQSpec<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = {
  query: t.IntersectionC<[t.TypeC<RequiredQuery>, t.PartialC<OptionalQuery>]>;
} & RouteSpec;
