require("jasmine-check").install();

import { gen } from "testcheck";
import { generateAsPath } from "./transform";
import { some } from "fp-ts/lib/Option";

describe("Transform", () => {
  check.it(
    "transform should generate asPath",
    gen.asciiString.notEmpty(),
    valueA => {
      expect(
        generateAsPath("/testA/:valueA", {
          valueA
        })
      ).toEqual(some(`/testA/${encodeURIComponent(valueA)}`));
    }
  );
});
