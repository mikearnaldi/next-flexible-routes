require("jasmine-check").install();

import { stringT, dateT, numberT } from ".";
import { right, left } from "fp-ts/lib/Either";

describe("Codecs", () => {
  it("stringT should encode string", () => {
    expect(stringT.encode("ok")).toEqual("ok");
  });
  it("stringT should decode string", () => {
    expect(stringT.decode("ok")).toEqual(right("ok"));
  });
  it("numberT should not decode string", () => {
    expect(numberT.decode("ok").mapLeft(_ => "error")).toEqual(left("error"));
  });
  it("numberT should decode string if is a number", () => {
    expect(numberT.decode("1").mapLeft(_ => "error")).toEqual(right(1));
  });
  it("numberT should not decode string if is not a number", () => {
    expect(numberT.decode("ok").mapLeft(_ => "error")).toEqual(left("error"));
  });
  it("dateT should not decode string if is not a date", () => {
    expect(dateT.decode("ok").mapLeft(_ => "error")).toEqual(left("error"));
  });
  it("dateT should not decode string if is a date", () => {
    const dt = new Date();

    expect(dateT.decode(dt.toISOString())).toEqual(right(dt));
  });
});
