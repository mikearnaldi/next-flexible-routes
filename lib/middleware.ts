import L from "lodash";
import rewriteOrNone from "./rewrite";
import { RequestHandler, Express, Request, Response } from "express";
import { option } from "fp-ts/lib/Option";
import { findFirst, array } from "fp-ts/lib/Array";
import { RouteArray } from "./types/RouteArray";

export const rewriteMiddleware: (routes: RouteArray) => RequestHandler = (
  routes: RouteArray
) => (req, _, next) => {
  const routeOpt = option.compact(
    findFirst(
      array.map(routes, route => rewriteOrNone(req.url, route, req.query)),
      r => r.isSome()
    )
  );

  if (routeOpt.isSome()) {
    req.url = routeOpt.toNullable();
  }

  next();
};

export const wireToExpress = (
  renderer: (page: string) => { render: (req: Request, res: Response) => void }
) => (routes: RouteArray, app: Express) => {
  // Wrap rewrite middleware
  app.use(rewriteMiddleware(routes));

  // Serve Dynamic Pages
  L.uniq(routes.map(r => r.page)).forEach(page => {
    app.get(`/${page}`, (req: Request, res: Response) => {
      renderer(page).render(req, res);
    });
  });
};
