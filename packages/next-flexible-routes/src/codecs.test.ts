require("jasmine-check").install();

import { stringT, dateT, numberT } from ".";
import { right, left, mapLeft } from "fp-ts/lib/Either";

describe("Codecs", () => {
  const mapError = mapLeft(_ => "error");

  it("stringT should encode string", () => {
    expect(stringT.encode("ok")).toEqual("ok");
  });
  it("stringT should decode string", () => {
    expect(stringT.decode("ok")).toEqual(right("ok"));
  });
  it("numberT should not decode string", () => {
    expect(mapError(numberT.decode("ok"))).toEqual(left("error"));
  });
  it("numberT should decode string if is a number", () => {
    expect(mapError(numberT.decode("1"))).toEqual(right(1));
  });
  it("dateT should not decode string if is not a date", () => {
    expect(mapError(dateT.decode("ok"))).toEqual(left("error"));
  });
  it("dateT should not decode string if is a date", () => {
    const dt = new Date();

    expect(dateT.decode(dt.toISOString())).toEqual(right(dt));
  });
  it("dateT should correctly guards for date", () => {
    const dt = new Date();

    expect(dateT.is(dt)).toEqual(true);
  });
});
