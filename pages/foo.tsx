import React from "react";
import Link from "next/link";

import { fooR, barR, homeR } from "../routes";

export default () => (
  <>
    <fooR.Match>
      {({ name, dt, id }) => (
        <div>
          Hi {name} Go to INDEX ({id} - {dt.toISOString()}):
          <Link {...homeR.linkTo()}>
            <a>GO!</a>
          </Link>
        </div>
      )}
    </fooR.Match>
    <barR.Match>
      {({ name }, { q, a }) => (
        <div>
          Hi {name} Go to INDEX {q && `(Opt: ${q})`} (Req: {a}):
          <Link {...homeR.linkTo()}>
            <a>GO!</a>
          </Link>
        </div>
      )}
    </barR.Match>
  </>
);
