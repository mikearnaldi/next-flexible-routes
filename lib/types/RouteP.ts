import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";
import { RouteSpec } from "./Route";

export type RouteP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
> = RoutePSpec<RequiredParams, OptionalParams> & {
  linkTo: (p: OptionalT<RequiredParams, OptionalParams>) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>
    ) => React.ReactElement;
  }>;
};

export type RoutePSpec<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
> = {
  params: t.IntersectionC<
    [t.TypeC<RequiredParams>, t.PartialC<OptionalParams>]
  >;
} & RouteSpec;
