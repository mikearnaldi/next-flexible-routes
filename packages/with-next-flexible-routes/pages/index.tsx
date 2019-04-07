import React from "react";
import Link from "next/link";
import { profileR } from "../routes";

const Home = () => (
  <div>
    <p>Home</p>
    <p>
      <Link {...profileR.linkTo({ name: "John" }, "end")}>
        <a>profile to #end</a>
      </Link>
      {" "}
      <Link {...profileR.linkTo({ name: "John" }, "top")}>
        <a>profile to #top</a>
      </Link>
    </p>
  </div>
);

export default Home;
