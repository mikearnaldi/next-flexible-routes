import * as t from "io-ts";

import { RoutePQ } from "./RoutePQ";
import { RouteQ } from "./RouteQ";
import { RouteP } from "./RouteP";
import { Route } from "./Route";

export type RouteU<
  P extends t.Props,
  PO extends t.Props,
  Q extends t.Props,
  QO extends t.Props
> = RoutePQ<P, PO, Q, QO> | RouteQ<Q, QO> | RouteP<P, PO> | Route;
