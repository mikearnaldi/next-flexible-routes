require("jasmine-check").install();

import { gen } from "testcheck";
import { defRPQ, defR, defRP, defRQ } from "./api";
import { T } from "./extended.iots";
import { stringT } from ".";

describe("Api", () => {
  it("defRPQ should throw if params are empty", () => {
    expect(() =>
      defRPQ({
        page: "foo",
        pattern: "/test",
        params: T.required({}),
        query: T.both(
          {
            a: stringT
          },
          {
            q: stringT
          }
        )
      })
    ).toThrow();
  });

  it("defRPQ should throw if query is empty", () => {
    expect(() =>
      defRPQ({
        page: "foo",
        pattern: "/test/:name",
        params: T.required({
          name: stringT
        }),
        query: T.required({})
      })
    ).toThrow();
  });

  it("defRP should throw if params are empty", () => {
    expect(() =>
      defRP({
        page: "foo",
        pattern: "/test",
        params: T.required({})
      })
    ).toThrow();
  });

  it("defRQ should throw if query is empty", () => {
    expect(() =>
      defRQ({
        page: "foo",
        pattern: "/test",
        query: T.required({})
      })
    ).toThrow();
  });

  it("defRPQ should throw if params not match", () => {
    expect(() =>
      defRPQ({
        page: "foo",
        pattern: "/test/:name/a",
        params: T.required({
          namz: stringT
        }),
        query: T.both(
          {
            a: stringT
          },
          {
            q: stringT
          }
        )
      })
    ).toThrow();
  });

  it("defRP should throw if params not match", () => {
    expect(() =>
      defRP({
        page: "foo",
        pattern: "/test/:name/a",
        params: T.required({
          namz: stringT
        })
      })
    ).toThrow();
  });

  check.it("api should generate linkTo for staticR correctly", () => {
    const routeC = defR({
      page: "testC",
      pattern: "/testC"
    });

    expect(routeC.linkTo()).toEqual({
      as: "/testC",
      href:
        "/testC?params=" +
        encodeURIComponent(JSON.stringify({})) +
        "&original=" +
        encodeURIComponent("/testC") +
        "&query=" +
        encodeURIComponent(JSON.stringify({}))
    });
  });

  check.it(
    "api should generate linkTo for parametricR correctly",
    gen.asciiString.notEmpty(),
    valueA => {
      const routeA = defRPQ({
        page: "testA",
        pattern: "/testA/:valueA",
        params: T.required({
          valueA: stringT
        }),
        query: T.optional({
          valueB: stringT
        })
      });

      const as = `/testA/${encodeURIComponent(
        valueA
      )}?valueB=${encodeURIComponent(valueA)}`;

      expect(routeA.linkTo({ valueA }, { valueB: valueA })).toEqual({
        as: as,
        href: `/testA?params=${encodeURIComponent(
          JSON.stringify({
            valueA
          })
        )}&original=${encodeURIComponent(as)}&query=${encodeURIComponent(
          JSON.stringify({
            valueB: valueA
          })
        )}`
      });
    }
  );
});
