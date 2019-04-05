require("jasmine-check").install();

import { gen } from "testcheck";
import { defRPQ, defRQ, defRP, defR } from "./api";
import { T } from "./extended.iots";
import { stringT } from ".";

describe("Api", () => {
  check.it(
    "api should describe parametric routes correctly",
    gen.asciiString.notEmpty(),
    gen.asciiString.notEmpty(),
    (valueA, valueB) => {
      const routeA = defRP({
        page: "testA",
        pattern: "/testA/:valueA/test",
        params: T.required({
          valueA: stringT
        })
      });

      const routeB = defRPQ({
        page: "testB",
        pattern: "/testB/:valueB",
        params: T.required({
          valueB: stringT
        }),
        query: T.required({
          valueQ: stringT
        })
      });

      expect(routeA.generateAsPath({ valueA })).toEqual(
        `/testA/${encodeURIComponent(valueA)}/test`
      );

      const encB = encodeURIComponent(valueB);

      expect(routeB.generateAsPath({ valueB }, { valueQ: valueB })).toEqual(
        `/testB/${encB}?valueQ=${encB}`
      );
    }
  );

  check.it("api should describe static routes correctly", () => {
    const routeC = defRQ({
      page: "testC",
      pattern: "/testC",
      query: T.optional({
        v: stringT
      })
    });

    expect(routeC.generateAsPath({ v: "test" })).toEqual(`/testC?v=test`);
    expect(routeC.generateAsPath({})).toEqual(`/testC`);
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
