import request from "supertest";
import express from "express";
import { wireToExpress, defRQ, T, numberT } from ".";

describe("Test the root path", () => {
  const port = 3000;
  const app = express();

  const barR = defRQ({
    page: "foo",
    pattern: "/test",
    query: T.required({
      n: numberT
    })
  });

  const remoteR = defRQ({
    page: "foo-remote",
    pattern: "/test-remote",
    query: T.required({
      n: numberT
    }),
    remote: "http://127.0.0.1:3000/ok"
  });

  wireToExpress(_ => ({
    render: (_, res) => {
      res.status(200).send("");
    }
  }))([barR, remoteR], app);

  app.get("/ok/foo-remote", (_, res) => {
    res.status(200).send("ok");
  });

  const server = app.listen(port, () => {});

  test("It should response the GET method", () => {
    return request(app)
      .get("/test?n=10")
      .expect(200);
  });

  test("It should proxy GET method", () => {
    return request(app)
      .get("/test-remote?n=10")
      .expect(200);
  });

  test("Stop server", () => {
    server.close();
  });
});
