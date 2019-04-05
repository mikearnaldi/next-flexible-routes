import { AsHref } from "./AsHref";

export type RouteSpec = {
  page: string;
  pattern: string;
};

export type Route = RouteSpec & {
  generateAsPath: () => string | undefined;
  pageUrl: () => string | undefined;
  linkTo: () => AsHref;
  Match: React.SFC<{
    children: () => React.ReactElement;
  }>;
};
