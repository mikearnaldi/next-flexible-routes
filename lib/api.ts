import React from "react";
import * as t from "io-ts";
import queryString from "query-string";
import { calculateUrl, matchOrNone } from "./rewrite";
import { generateAsPath } from "./transform";
import { RouteQ, RouteQSpec } from "./types/RouteQ";
import { RoutePQ, RoutePQSpec } from "./types/RoutePQ";
import { withRouter } from "next/router";
import { fromEither, tryCatch, option } from "fp-ts/lib/Option";
import { Do } from "fp-ts-contrib/lib/Do";
import { RouteSpec, Route } from "./types/Route";
import { RoutePSpec, RouteP } from "./types/RouteP";

function parseQuery(query: Record<string, string | string[]>) {
  return tryCatch(() =>
    query.query && typeof query.query === "string"
      ? JSON.parse(query.query)
      : {}
  );
}

function parseParams(query: Record<string, string | string[]>) {
  return tryCatch(() =>
    query.params && typeof query.params === "string"
      ? JSON.parse(query.params)
      : {}
  );
}

function matchQuery(
  query: Record<string, string | string[]>,
  asPath: string,
  pattern: string
) {
  return matchOrNone(
    query.original && typeof query.original === "string"
      ? query.original
      : asPath,
    pattern
  );
}

export function defRPQ<
  P extends t.Props,
  PO extends t.Props,
  Q extends t.Props,
  QO extends t.Props
>(route: RoutePQSpec<P, PO, Q, QO>): RoutePQ<P, PO, Q, QO> {
  type TP = t.TypeOf<typeof route.params>;
  type TQ = t.TypeOf<typeof route.query>;

  const asPath = (params: TP, query: TQ) =>
    Do(option)
      .bind("qs", option.of(queryString.stringify(query, { strict: false })))
      .bind("path", generateAsPath(route.pattern, params))
      .return(s => `${s.path}${s.qs.length > 0 ? `?${s.qs}` : ""}`)
      .toNullable();

  const pageUrl = (params: TP, query: TQ) =>
    calculateUrl({
      original: asPath(params, query),
      page: route.page,
      params,
      query
    });

  const Match: React.SFC<{
    children: (p: TP, q: TQ) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router: { query, asPath } }) =>
        Do(option)
          .bindL("match", _ => matchQuery(query, asPath, route.pattern))
          .bindL("parse", _ => parseParams(query))
          .bindL("query", _ => parseQuery(query))
          .bindL("decodedQuery", s => fromEither(route.query.decode(s.query)))
          .bindL("decodedParams", s => fromEither(route.params.decode(s.parse)))
          .return(s => children(s.decodedParams, s.decodedQuery))
          .toNullable()
      )
    );

  return {
    ...route,
    generateAsPath: asPath,
    pageUrl: pageUrl,
    linkTo: (params: TP, query: TQ) => ({
      as: asPath(route.params.encode(params), query),
      href: pageUrl(route.params.encode(params), query)
    }),
    Match
  };
}

export function defRP<P extends t.Props, PO extends t.Props>(
  route: RoutePSpec<P, PO>
): RouteP<P, PO> {
  type TP = t.TypeOf<typeof route.params>;

  const asPath = (params: TP) =>
    generateAsPath(route.pattern, params).toNullable();

  const pageUrl = (params: TP) =>
    calculateUrl({
      original: asPath(params),
      page: route.page,
      params,
      query: {}
    });

  const Match: React.SFC<{
    children: (p: TP) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router: { query, asPath } }) =>
        Do(option)
          .bindL("match", _ => matchQuery(query, asPath, route.pattern))
          .bindL("parse", _ => parseParams(query))
          .bindL("decodedParams", s => fromEither(route.params.decode(s.parse)))
          .return(s => children(s.decodedParams))
          .toNullable()
      )
    );

  return {
    ...route,
    generateAsPath: asPath,
    pageUrl: pageUrl,
    linkTo: (params: TP) => ({
      as: asPath(route.params.encode(params)),
      href: pageUrl(route.params.encode(params))
    }),
    Match
  };
}

export function defRQ<Q extends t.Props, QO extends t.Props>(
  route: RouteQSpec<Q, QO>
): RouteQ<Q, QO> {
  type TQ = t.TypeOf<typeof route.query>;

  const asPath = (query: TQ) => {
    const qs = queryString.stringify(query, { strict: false });

    return generateAsPath(route.pattern, {})
      .map(s => `${s}${qs.length > 0 ? `?${qs}` : ""}`)
      .toNullable();
  };

  const pageUrl = (query: TQ) =>
    calculateUrl({
      original: route.pattern,
      page: route.page,
      params: {},
      query: query
    });

  const Match: React.SFC<{
    children: (q: TQ) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router: { query, asPath } }) =>
        Do(option)
          .bindL("match", _ => matchQuery(query, asPath, route.pattern))
          .bindL("query", _ => parseQuery(query))
          .bindL("decodedQuery", s => fromEither(route.query.decode(s.query)))
          .return(s => children(s.decodedQuery))
          .toNullable()
      )
    );

  return {
    ...route,
    generateAsPath: asPath,
    pageUrl: pageUrl,
    linkTo: (query: TQ) => ({
      as: asPath(query),
      href: pageUrl(query)
    }),
    Match
  };
}

export function defR(route: RouteSpec): Route {
  const asPath = () => generateAsPath(route.pattern, {}).toNullable();

  const pageUrl = () =>
    calculateUrl({
      original: route.pattern,
      page: route.page,
      params: {},
      query: {}
    });

  const Match: React.SFC<{
    children: () => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router: { query, asPath } }) =>
        Do(option)
          .bindL("match", _ => matchQuery(query, asPath, route.pattern))
          .return(_ => children())
          .toNullable()
      )
    );

  return {
    ...route,
    generateAsPath: asPath,
    pageUrl: pageUrl,
    linkTo: () => ({
      as: asPath(),
      href: pageUrl()
    }),
    Match
  };
}
