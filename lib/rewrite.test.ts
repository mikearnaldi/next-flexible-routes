require("jasmine-check").install();

import rewriteOrNone from "./rewrite";
import { gen } from "testcheck";
import { some } from "fp-ts/lib/Option";
import { defRP } from "./api";
import { T } from "./extended.iots";
import { stringT } from "./codecs";

describe("Rewrite", () => {
  check.it("should rewrite matching url", gen.asciiString.notEmpty(), value => {
    const route = defRP({
      page: "b",
      pattern: "/test/:name",
      params: T.required({
        name: stringT
      })
    });

    const urlEncodedValue = encodeURIComponent(value);

    const result = rewriteOrNone(`/test/${urlEncodedValue}`, route, {});

    expect({
      result,
      value
    }).toEqual({
      result: some(
        "/b?params=" +
          encodeURIComponent(
            JSON.stringify({
              name: value
            })
          ) +
          "&original=" +
          encodeURIComponent(`/test/${urlEncodedValue}`) +
          "&query=" +
          encodeURIComponent(JSON.stringify({}))
      ),
      value
    });
  });

  check.it(
    "should rewrite matching url with optional parameter",
    gen.asciiString.notEmpty(),
    value => {
      const route = defRP({
        page: "b",
        pattern: "/test/:name?",
        params: T.optional({
          name: stringT
        })
      });

      const urlEncodedValue = encodeURIComponent(value);

      const result = rewriteOrNone(`/test/${urlEncodedValue}`, route, {});

      expect({
        result,
        value
      }).toEqual({
        result: some(
          "/b?params=" +
            encodeURIComponent(
              JSON.stringify({
                name: value
              })
            ) +
            "&original=" +
            encodeURIComponent(`/test/${urlEncodedValue}`) +
            "&query=" +
            encodeURIComponent(JSON.stringify({}))
        ),
        value
      });
    }
  );

  check.it(
    "should rewrite matching url with optional parameter to none",
    () => {
      const route = defRP({
        page: "b",
        pattern: "/test/:name?",
        params: T.optional({
          name: stringT
        })
      });

      const result = rewriteOrNone(`/test`, route, {});

      expect({
        result
      }).toEqual({
        result: some(
          "/b?params=" +
            encodeURIComponent(
              JSON.stringify({
                name: undefined
              })
            ) +
            "&original=" +
            encodeURIComponent(`/test`) +
            "&query=" +
            encodeURIComponent(JSON.stringify({}))
        )
      });
    }
  );
});
