import React from "react";
import * as t from "io-ts";
import L from "lodash";
import pr from "path-to-regexp";
import queryString from "query-string";
import { calculateUrl, matchOrNone } from "./rewrite";
import { generateAsPath } from "./transform";
import { RouteQ, RouteQSpec } from "./types/RouteQ";
import { RoutePQ, RoutePQSpec } from "./types/RoutePQ";
import { withRouter } from "next/router";
import { fromEither, tryCatch, option, fromNullable } from "fp-ts/lib/Option";
import { Do } from "fp-ts-contrib/lib/Do";
import { RouteSpec, Route } from "./types/Route";
import { RoutePSpec, RouteP } from "./types/RouteP";
import { IntersectionType } from "./types/OptionalT";

function parseQuery(query: Record<string, string | string[] | undefined>) {
  return tryCatch(() =>
    query.query && typeof query.query === "string"
      ? JSON.parse(query.query)
      : {}
  );
}

function parseParams(query: Record<string, string | string[] | undefined>) {
  return tryCatch(() =>
    query.params && typeof query.params === "string"
      ? JSON.parse(query.params)
      : {}
  );
}

function matchQuery(
  query: Record<string, string | string[] | undefined>,
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

function throwIfWrongParams<Required extends t.Props, Optional extends t.Props>(
  route: RouteSpec & { params: IntersectionType<Required, Optional> }
) {
  const params = L.flatten(route.params.types.map(p => Object.keys(p.props)));
  const inPattern = pr
    .parse(route.pattern)
    .filter(e => typeof e === "object")
    .map(o => L.get(o, "name"));

  if (!L.isEqual(params, inPattern)) {
    throw new Error(
      "parameters (" +
        params.join(",") +
        ") specified in .params should match parameters specified in pattern: " +
        route.pattern
    );
  }
}

export function defRPQ<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props,
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
>(
  route: RoutePQSpec<
    RequiredParams,
    OptionalParams,
    RequiredQuery,
    OptionalQuery
  >
): RoutePQ<RequiredParams, OptionalParams, RequiredQuery, OptionalQuery> {
  type TypeParams = t.TypeOf<typeof route.params>;
  type TypeQuery = t.TypeOf<typeof route.query>;

  throwIfWrongParams(route);

  const asPath = (params: TypeParams, query: TypeQuery) =>
    Do(option)
      .bind("qs", option.of(queryString.stringify(query, { strict: false })))
      .bind("path", generateAsPath(route.pattern, params))
      .return(s => `${s.path}${s.qs.length > 0 ? `?${s.qs}` : ""}`)
      .toUndefined();

  const pageUrl = (params: TypeParams, query: TypeQuery) =>
    calculateUrl({
      original: asPath(params, query),
      page: route.page,
      params,
      query
    });

  const Match: React.FunctionComponent<{
    children: (p: TypeParams, q: TypeQuery) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router }) =>
        Do(option)
          .bindL("query", _ => fromNullable(L.get(router, "query")))
          .bindL("asPath", _ => fromNullable(L.get(router, "asPath")))
          .bindL("match", s => matchQuery(s.query, s.asPath, route.pattern))
          .bindL("parsedParams", s => parseParams(s.query))
          .bindL("parsedQuery", s => parseQuery(s.query))
          .bindL("decodedQuery", s =>
            fromEither(route.query.decode(s.parsedQuery))
          )
          .bindL("decodedParams", s =>
            fromEither(route.params.decode(s.parsedParams))
          )
          .return(s => children(s.decodedParams, s.decodedQuery))
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: (params: TypeParams, query: TypeQuery) => ({
      as: asPath(route.params.encode(params), query),
      href: pageUrl(route.params.encode(params), query)
    }),
    Match
  };
}
export function defRP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
>(
  route: RoutePSpec<RequiredParams, OptionalParams>
): RouteP<RequiredParams, OptionalParams> {
  type TypeParams = t.TypeOf<typeof route.params>;

  throwIfWrongParams(route);

  const asPath = (params: TypeParams) =>
    generateAsPath(route.pattern, params).toUndefined();

  const pageUrl = (params: TypeParams) =>
    calculateUrl({
      original: asPath(params),
      page: route.page,
      params,
      query: {}
    });

  const Match: React.FunctionComponent<{
    children: (p: TypeParams) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router }) =>
        Do(option)
          .bindL("query", _ => fromNullable(L.get(router, "query")))
          .bindL("asPath", _ => fromNullable(L.get(router, "asPath")))
          .bindL("match", s => matchQuery(s.query, s.asPath, route.pattern))
          .bindL("parse", s => parseParams(s.query))
          .bindL("decodedParams", s => fromEither(route.params.decode(s.parse)))
          .return(s => children(s.decodedParams))
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: (params: TypeParams) => ({
      as: asPath(route.params.encode(params)),
      href: pageUrl(route.params.encode(params))
    }),
    Match
  };
}

export function defRQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
>(
  route: RouteQSpec<RequiredQuery, OptionalQuery>
): RouteQ<RequiredQuery, OptionalQuery> {
  type TypeQuery = t.TypeOf<typeof route.query>;

  const asPath = (query: TypeQuery) => {
    const qs = queryString.stringify(query, { strict: false });

    return generateAsPath(route.pattern, {})
      .map(s => `${s}${qs.length > 0 ? `?${qs}` : ""}`)
      .toUndefined();
  };

  const pageUrl = (query: TypeQuery) =>
    calculateUrl({
      original: route.pattern,
      page: route.page,
      params: {},
      query: query
    });

  const Match: React.FunctionComponent<{
    children: (q: TypeQuery) => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router }) =>
        Do(option)
          .bindL("query", _ => fromNullable(L.get(router, "query")))
          .bindL("asPath", _ => fromNullable(L.get(router, "asPath")))
          .bindL("match", s => matchQuery(s.query, s.asPath, route.pattern))
          .bindL("parsedQuery", s => parseQuery(s.query))
          .bindL("decodedQuery", s =>
            fromEither(route.query.decode(s.parsedQuery))
          )
          .return(s => children(s.decodedQuery))
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: (query: TypeQuery) => ({
      as: asPath(route.query.encode(query)),
      href: pageUrl(route.query.encode(query))
    }),
    Match
  };
}

export function defR(route: RouteSpec): Route {
  const asPath = () => generateAsPath(route.pattern, {}).toUndefined();

  const pageUrl = () =>
    calculateUrl({
      original: route.pattern,
      page: route.page,
      params: {},
      query: {}
    });

  const Match: React.FunctionComponent<{
    children: () => React.ReactElement;
  }> = ({ children }) =>
    React.createElement(
      withRouter(({ router }) =>
        Do(option)
          .bindL("query", _ => fromNullable(L.get(router, "query")))
          .bindL("asPath", _ => fromNullable(L.get(router, "asPath")))
          .bindL("match", s => matchQuery(s.query, s.asPath, route.pattern))
          .return(_ => children())
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: () => ({
      as: asPath(),
      href: pageUrl()
    }),
    Match
  };
}
