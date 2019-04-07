import * as t from "io-ts";

/**
 * Define a codec for number represented as string
 * t.Type<*, string, unknown> is enforced
 */
export const numberT = new t.Type<number, string, unknown>(
  "NumberCodec",
  t.number.is,
  (src, context) =>
    t.string.validate(src, context).chain(s => {
      const n = parseFloat(s);
      return isNaN(n) ? t.failure(src, context) : t.success(n);
    }),
  String
);

/**
 * Define a codec for string represented as string
 * t.Type<*, string, unknown> is enforced
 */
export const stringT = new t.Type<string, string, unknown>(
  "StringCodec",
  t.string.is,
  (src, context) => t.string.validate(src, context).chain(s => t.success(s)),
  String
);

/**
 * Define a codec for date represented as iso string
 * t.Type<*, string, unknown> is enforced
 */
export const dateT = new t.Type<Date, string, unknown>(
  "DateFromString",
  (src): src is Date => src instanceof Date,
  (src, context) =>
    t.string.validate(src, context).chain(s => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(src, context) : t.success(d);
    }),
  dt => dt.toISOString()
);
