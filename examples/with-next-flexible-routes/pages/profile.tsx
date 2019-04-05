import React from "react";
import { homeR, profileR, accountR } from "../routes";
import Link from "next/link";

const Profile = () => (
  <profileR.Match>
    {({ name }) => (
      <div>
        <p>Hello {name}</p>
        <p>
          <Link {...homeR.linkTo()}>
            <a>home</a>
          </Link>
          &nbsp;
          <Link {...accountR.linkTo({ name }, { id: "0100022356" })}>
            <a>account</a>
          </Link>
        </p>
      </div>
    )}
  </profileR.Match>
);

export default Profile;
