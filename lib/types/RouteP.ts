import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RouteP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
> = RoutePSpec<RequiredParams, OptionalParams> & {
  generateAsPath: (p: OptionalT<RequiredParams, OptionalParams>) => string;
  pageUrl: (p: OptionalT<RequiredParams, OptionalParams>) => string;
  linkTo: (p: OptionalT<RequiredParams, OptionalParams>) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>
    ) => React.ReactElement;
  }>;
};

export type RoutePSpec<P extends t.Props, PO extends t.Props> = {
  page: string;
  pattern: string;
  params: t.IntersectionC<[t.TypeC<P>, t.PartialC<PO>]>;
};
