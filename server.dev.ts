import express from "express";
import next from "next";
import { rewriteMiddleware } from "./lib";
import { routes } from "./routes";

const port = parseInt(process.env.PORT, 10) || 3000;
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
