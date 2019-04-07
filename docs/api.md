# Routes Definitions
Every function will define a route, based on the structure of your route you will have to chose between ```defR/defRQ/defRP/defRPQ```

Once constructed routes will expose two APIs:
* linkTo: function used to generate links (as/href for Link component)
* Match: react component to match and extract params/query

Examples can be found at [with-next-flexible-routes](../packages/with-next-flexible-routes) or in tests [api-react](../packages/next-flexible-routes/src/api.react.test.tsx)

## defR
Define route without parameters or query 
```
export const homeR = defR({
  page: "index",
  pattern: "/"
});
```

the route will expose the following API
```
export type Route = RouteSpec & {
  linkTo: (hash?: string) => AsHref;
  Match: React.SFC<{
    children: () => React.ReactElement;
  }>;
};
```

## defRQ
Define route without parameters with query 
```
export const accountRQ = defRQ({
  page: "account",
  pattern: "/account",
  query: T.required({
    id: stringT
  })
});
```

the route will expose the following API
```
export type RouteQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RouteQSpec<RequiredQuery, OptionalQuery> & {
  linkTo: (q: OptionalT<RequiredQuery, OptionalQuery>, hash?: string) => AsHref;
  Match: React.SFC<{
    children: (
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};
```

## defRP
Define route with parameters without query 
```
export const accountRP = defRP({
  page: "account",
  pattern: "/account/:id",
  params: T.required({
    id: stringT
  })
});
```

the route will expose the following API
```
export type RouteP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
> = RoutePSpec<RequiredParams, OptionalParams> & {
  linkTo: (p: OptionalT<RequiredParams, OptionalParams>, hash?: string) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>
    ) => React.ReactElement;
  }>;
};
```

## defRPQ
Define route with parameters and query 
```
export const accountRPQ = defRPQ({
  page: "account",
  pattern: "/profile/:name/account",
  params: T.required({
    name: stringT
  }),
  query: T.required({
    id: stringT
  }),
});
```
the route will expose the following API
```
export type RoutePQ<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props,
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
> = RoutePQSpec<
  RequiredParams,
  OptionalParams,
  RequiredQuery,
  OptionalQuery
> & {
  linkTo: (
    p: OptionalT<RequiredParams, OptionalParams>,
    q: OptionalT<RequiredQuery, OptionalQuery>,
    hash?: string
  ) => AsHref;
  Match: React.SFC<{
    children: (
      p: OptionalT<RequiredParams, OptionalParams>,
      q: OptionalT<RequiredQuery, OptionalQuery>
    ) => React.ReactElement;
  }>;
};
```

## Additional
Every route definition function takes ```remote``` option to specify the host of the page (in case remotely deployed), for example:

```
export const accountRP = defRP({
  page: "account",
  pattern: "/account/:id",
  params: T.required({
    id: stringT
  }),
  remote: "https://www.example.org/base-path"
});
```

will proxy to ```https://www.example.org/base-path/account```

## Note
Keep route definition separated from pages to reduce the dependencies needed for the server to load.

Organize route definitions as you prefer based on your own needs, you will need to import the routes individually to generate links and extract parameters (follow example).