import express from "express";
import next from "next";
import { rewriteMiddleware } from "next-flexible-routes";
import { routes } from "./routes";

const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev: process.env.NODE_ENV === "production" ? false : true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use("/", express.static("./static"));
  
  server.use(rewriteMiddleware(routes));

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
