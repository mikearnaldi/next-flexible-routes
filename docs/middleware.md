# Express Middleware
Takes a list of routes and generate the rewrite rules, needs to be wrapped with ```.use```

```
export const rewriteMiddleware: (routes: RouteArray) => RequestHandler
```

example of usage in [with-next-flexible-routes/server.ts](../packages/with-next-flexible-routes/server.ts)

# wireToExpress
Utility to wrap middleware to express including a generic page renderer, example of usage in [with-next-flexible-routes/server.minimal.ts](../packages/with-next-flexible-routes/server.minimal.ts) (uses serverless build to optimize for cold start)