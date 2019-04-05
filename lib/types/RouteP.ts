import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RouteP<P extends t.Props, PO extends t.Props> = RoutePSpec<
  P,
  PO
> & {
  generateAsPath: (p: OptionalT<P, PO>) => string;
  pageUrl: (p: OptionalT<P, PO>) => string;
  linkTo: (p: OptionalT<P, PO>) => AsHref;
  Match: React.SFC<{
    children: (p: OptionalT<P, PO>) => React.ReactElement;
  }>;
};

export type RoutePSpec<P extends t.Props, PO extends t.Props> = {
  page: string;
  pattern: string;
  params: t.IntersectionC<[t.TypeC<P>, t.PartialC<PO>]>;
};
