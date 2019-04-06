import express from "express";
import next from "next";
import { rewriteMiddleware } from "./lib";
import { routes } from "./routes";
import L from "lodash";

const port = parseInt(L.get(process, "env.PORT", "3000"), 10);
const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(rewriteMiddleware(routes));

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
