import L from "lodash";
import rewriteOrNone from "./rewrite";
import { RequestHandler, Express, Request, Response } from "express";
import httpProxy from "http-proxy";

import { option } from "fp-ts/lib/Option";
import { findFirst, array } from "fp-ts/lib/Array";
import { RouteArray } from "./types/RouteArray";

const proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

export const rewriteMiddleware: (routes: RouteArray) => RequestHandler = (
  routes: RouteArray
) => (req, res, next) => {
  const routeOpt = option.compact(
    findFirst(
      array.map(routes, route =>
        rewriteOrNone(req.url, route, req.query).map(r => ({
          rewrite: r,
          route
        }))
      ),
      r => r.isSome()
    )
  );

  routeOpt.foldL(
    () => () => {
      next();
    },
    ({ rewrite, route }) => () => {
      req.url = rewrite;

      if (typeof route.remote !== "undefined") {
        proxy.web(req, res, { target: route.remote });
      } else {
        next();
      }
    }
  )();
};

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
