require("jasmine-check").install();

import { gen } from "testcheck";
import { defRPQ, defR } from "./api";
import { T } from "./extended.iots";
import { stringT } from ".";

describe("Api", () => {
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
