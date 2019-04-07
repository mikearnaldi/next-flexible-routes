import { AsHref } from "./AsHref";

/**
 * Basic Route Specification, used in case no params or query are used
 */
export type RouteSpec = {
  page: string;
  pattern: string;
  remote?: string;
};

/**
 * Route API exposed from defR
 */
export type Route = RouteSpec & {
  linkTo: (hash?: string) => AsHref;
  Match: React.SFC<{
    children: () => React.ReactElement;
  }>;
};
