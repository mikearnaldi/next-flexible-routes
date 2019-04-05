import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

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
  generateAsPath: (
    p: OptionalT<RequiredParams, OptionalParams>,
    q: OptionalT<RequiredQuery, OptionalQuery>
  ) => string;
  pageUrl: (
    p: OptionalT<RequiredParams, OptionalParams>,
    q: OptionalT<RequiredQuery, OptionalQuery>
  ) => string;
  linkTo: (
    p: OptionalT<RequiredParams, OptionalParams>,
    q: OptionalT<RequiredQuery, OptionalQuery>
  ) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>,
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};

export type RoutePQSpec<
  P extends t.Props,
  PO extends t.Props,
  Q extends t.Props,
  QO extends t.Props
> = {
  page: string;
  pattern: string;
  params: t.IntersectionC<[t.TypeC<P>, t.PartialC<PO>]>;
  query: t.IntersectionC<[t.TypeC<Q>, t.PartialC<QO>]>;
};
