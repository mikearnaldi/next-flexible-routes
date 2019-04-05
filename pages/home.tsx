import React from "react";
import Link from "next/link";

import { fooR, barR, homeR } from "../routes";

export default () => (
  <homeR.Match>
    {() => (
      <div>
        Go to B:
        <Link
          {...fooR.linkTo({
            name: "foo",
            id: 22,
            dt: new Date("2019-03-31T15:27:42.170Z")
          })}
        >
          <a>(through fooR)</a>
        </Link>
        &nbsp;Or&nbsp;
        <Link {...barR.linkTo({ name: "bar" }, { a: "REQ", q: "OPT" })}>
          <a>(through barR)</a>
        </Link>
        &nbsp;Or&nbsp;
        <Link {...barR.linkTo({ name: "bar" }, { a: "REQ" })}>
          <a>(through barR without q)</a>
        </Link>
      </div>
    )}
  </homeR.Match>
);
