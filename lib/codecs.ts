import * as t from "io-ts";

export const numberT = new t.Type<number, string, string>(
  "NumberCodec",
  t.number.is,
  (src, context) => {
    const n = parseFloat(src);
    return isNaN(n) ? t.failure(src, context) : t.success(n);
  },
  String
) as t.Mixed;

export const stringT = new t.Type<string, string, string>(
  "StringCodec",
  t.string.is,
  (src, _) => {
    return t.success(src);
  },
  String
) as t.Mixed;

export const dateT = new t.Type<Date, string, unknown>(
  "DateFromString",
  (src): src is Date => src instanceof Date,
  (src, context) =>
    t.string.validate(src, context).chain(s => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(src, context) : t.success(d);
    }),
  dt => dt.toISOString()
) as t.Mixed;
