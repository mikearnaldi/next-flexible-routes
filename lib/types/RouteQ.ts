import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RouteQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RouteQSpec<RequiredQuery, OptionalQuery> & {
  generateAsPath: (q: OptionalT<RequiredQuery, OptionalQuery>) => string;
  pageUrl: (q: OptionalT<RequiredQuery, OptionalQuery>) => string;
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
  page: string;
  pattern: string;
  query: t.IntersectionC<[t.TypeC<RequiredQuery>, t.PartialC<OptionalQuery>]>;
};
