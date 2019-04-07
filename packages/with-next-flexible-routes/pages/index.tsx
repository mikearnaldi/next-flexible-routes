import React from "react";
import Link from "next/link";
import { profileR } from "../routes";

const Home = () => (
  <div>
    <p>Home</p>
    <p>
      <Link {...profileR.linkTo({ name: "John" })}>
        <a>profile</a>
      </Link>
    </p>
  </div>
);

export default Home;
