import { defR, defRP, T, stringT, defRPQ } from "next-flexible-routes";

export const profileR = defRP({
  page: "profile",
  pattern: "/profile/:name",
  params: T.required({
    name: stringT
  })
});

export const accountR = defRPQ({
  page: "account",
  pattern: "/profile/:name/account",
  params: T.required({
    name: stringT
  }),
  query: T.required({
    id: stringT
  })
});

export const homeR = defR({
  page: "index",
  pattern: "/"
});

export const routes = [profileR, accountR, homeR];
