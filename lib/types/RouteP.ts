import * as t from "io-ts";

import { AsHref } from "./AsHref";
import { OptionalT } from "./OptionalT";

export type RouteP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
> = RoutePSpec<RequiredParams, OptionalParams> & {
  generateAsPath: (
    p: OptionalT<RequiredParams, OptionalParams>
  ) => string | undefined;
  pageUrl: (p: OptionalT<RequiredParams, OptionalParams>) => string | undefined;
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
  page: string;
  pattern: string;
  params: t.IntersectionC<
    [t.TypeC<RequiredParams>, t.PartialC<OptionalParams>]
  >;
};
