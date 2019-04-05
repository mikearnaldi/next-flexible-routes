import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RouteQ<Q extends t.Props, QO extends t.Props> = RouteQSpec<
  Q,
  QO
> & {
  generateAsPath: (q: OptionalT<Q, QO>) => string;
  pageUrl: (q: OptionalT<Q, QO>) => string;
  linkTo: (q: OptionalT<Q, QO>) => AsHref;
  Match: React.SFC<{
    children: (q: OptionalT<Q, QO>) => React.ReactElement;
  }>;
};

export type RouteQSpec<Q extends t.Props, QO extends t.Props> = {
  page: string;
  pattern: string;
  query: t.IntersectionC<[t.TypeC<Q>, t.PartialC<QO>]>;
};
