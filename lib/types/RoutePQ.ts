import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RoutePQ<
  P extends t.Props,
  PO extends t.Props,
  Q extends t.Props,
  QO extends t.Props
> = RoutePQSpec<P, PO, Q, QO> & {
  generateAsPath: (p: OptionalT<P, PO>, q: OptionalT<Q, QO>) => string;
  pageUrl: (p: OptionalT<P, PO>, q: OptionalT<Q, QO>) => string;
  linkTo: (p: OptionalT<P, PO>, q: OptionalT<Q, QO>) => AsHref;
  Match: React.SFC<{
    children: (p: OptionalT<P, PO>, q: OptionalT<Q, QO>) => React.ReactElement;
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
