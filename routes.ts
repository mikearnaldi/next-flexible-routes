import { defRPQ, defR, defRP, stringT, numberT, dateT, T } from "./lib";

export const fooR = defRP({
  page: "foo",
  pattern: "/test/:name/:id/:dt",
  params: T.required({
    name: stringT,
    id: numberT,
    dt: dateT
  })
});

export const barR = defRPQ({
  page: "foo",
  pattern: "/test/:name/a",
  params: T.required({
    name: stringT
  }),
  query: T.both(
    {
      a: stringT
    },
    {
      q: stringT
    }
  )
});

export const homeR = defR({
  page: "home",
  pattern: "/"
});

export const routes = [homeR, fooR, barR];
