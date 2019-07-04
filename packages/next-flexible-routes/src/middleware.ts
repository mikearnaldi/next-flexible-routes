import L from "lodash";
import rewriteOrNone from "./rewrite";
import { RequestHandler, Express, Request, Response } from "express";
import httpProxy from "http-proxy";

import { option, Option, isSome, fold } from "fp-ts/lib/Option";
import { findFirst, array } from "fp-ts/lib/Array";
import { RouteArray } from "./types/RouteArray";
import { RouteSpec } from "./types/Route";

/**
 * Prepare proxy server
 */
const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

/**
 * Define an middleware from a list of routes, used to rewrite pretty path
 * to internal representation
 */
export const rewriteMiddleware: (routes: RouteArray) => RequestHandler = (
  routes: RouteArray
) => (req, res, next) => {
  const routeOpt = option.compact(
    findFirst((r: Option<{ rewrite: string; route: RouteSpec }>) => isSome(r))(
      array.map(routes, route =>
        option.map(rewriteOrNone(req.url, route, req.query), rewrite => ({
          rewrite,
          route
        }))
      )
    )
  );

  fold(
    () => () => {
      next();
    },
    ({ rewrite, route }: { rewrite: string; route: RouteSpec }) => () => {
      req.url = rewrite;

      if (typeof route.remote !== "undefined") {
        proxy.web(req, res, { target: route.remote });
      } else {
        next();
      }
    }
  )(routeOpt)();
};

/**
 * Wire middleware and custom page renderer to express
 */
export const wireToExpress = (
  renderer: (page: string) => { render: (req: Request, res: Response) => void }
) => (routes: RouteArray, app: Express) => {
  // Wrap rewrite middleware
  app.use(rewriteMiddleware(routes));

  // Serve Local Pages
  L.uniq(
    routes.filter(r => typeof r.remote === "undefined").map(r => r.page)
  ).forEach(page => {
    app.get(`/${page}`, (req: Request, res: Response) => {
      renderer(page).render(req, res);
    });
  });
};
