import { AsHref } from "./AsHref";

export type RouteSpec = {
  page: string;
  pattern: string;
};

export type Route = RouteSpec & {
  linkTo: () => AsHref;
  Match: React.SFC<{
    children: () => React.ReactElement;
  }>;
};
