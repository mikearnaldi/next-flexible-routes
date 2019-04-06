import request from "supertest";
import express = require("express");
import { wireToExpress, defRQ, T, numberT } from ".";

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    const port = 3000;
    const app = express();

    const barR = defRQ({
      page: "foo",
      pattern: "/test",
      query: T.required({
        n: numberT
      })
    });

    wireToExpress(_ => ({
      render: (_, res) => {
        res.status(200).send("");
      }
    }))([barR], app);

    app.listen(port, () => {});

    return request(app)
      .get("/test?n=10")
      .expect(200);
  });
});
