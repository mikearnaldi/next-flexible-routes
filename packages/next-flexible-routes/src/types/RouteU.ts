import * as t from "io-ts";

import { RoutePQ } from "./RoutePQ";
import { RouteQ } from "./RouteQ";
import { RouteP } from "./RouteP";
import { Route } from "./Route";

/**
 * Unify Route into an ADT
 */
export type RouteU<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props,
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> =
  | RoutePQ<RequiredParams, OptionalParams, RequiredQuery, OptionalQuery>
  | RouteQ<RequiredQuery, OptionalQuery>
  | RouteP<RequiredParams, OptionalParams>
  | Route;
