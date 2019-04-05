import * as t from "io-ts";

export const numberT = new t.Type<number, string, string>(
  "NumberCodec",
  t.number.is,
  (s, c) => {
    const n = parseFloat(s);
    return isNaN(n) ? t.failure(s, c) : t.success(n);
  },
  String
) as t.Mixed;

export const stringT = new t.Type<string, string, string>(
  "StringCodec",
  t.string.is,
  (s, _c) => {
    return t.success(s);
  },
  String
) as t.Mixed;

export const dateT = new t.Type<Date, string, unknown>(
  "DateFromString",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    t.string.validate(u, c).chain(s => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  a => a.toISOString()
) as t.Mixed;
