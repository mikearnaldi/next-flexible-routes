import express from "express";

import { wireToExpress } from "next-flexible-routes";
import { routes } from "./routes";

const port = 3000;
const app = express();

// Serve Static Files
app.use("/", express.static("./static"));
app.use("/_next/static", express.static("./.next/static"));

wireToExpress(page => require(`./.next/serverless/pages/${page}`))(routes, app);

// Listen on a specified port
app.listen(port, () => console.log(`listening on port ${port}!`));