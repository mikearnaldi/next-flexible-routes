import React from "react";
import { homeR, profileR, accountR } from "../routes";
import Link from "next/link";

const Account = () => (
  <accountR.Match>
    {({ name }, { id }) => (
      <div>
        <p>Hello {name}</p>
        <p>Account id: {id}</p>
        <p>
          <Link {...homeR.linkTo()}>
            <a>home</a>
          </Link>
          &nbsp;
          <Link {...profileR.linkTo({ name })}>
            <a>profile</a>
          </Link>
        </p>
      </div>
    )}
  </accountR.Match>
);

export default Account;
