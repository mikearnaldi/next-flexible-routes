import { AsHref } from "./AsHref";

export type RouteSpec = {
  page: string;
  pattern: string;
  remote?: string;
};

export type Route = RouteSpec & {
  linkTo: (hash?: string) => AsHref;
  Match: React.SFC<{
    children: () => React.ReactElement;
  }>;
};
