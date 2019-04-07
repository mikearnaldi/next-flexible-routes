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
import {
  fromEither,
  tryCatch,
  option,
  fromNullable,
  Option
} from "fp-ts/lib/Option";
import { Do } from "fp-ts-contrib/lib/Do";
import { RouteSpec, Route } from "./types/Route";
import { RoutePSpec, RouteP } from "./types/RouteP";
import { IntersectionType } from "./types/OptionalT";

/**
 * Extract and parse original query from internal representation
 *
 * @param {(Record<string, string | string[] | undefined>)} query
 * @returns {Option<any>}
 */
function parseQuery(
  query: Record<string, string | string[] | undefined>
): Option<any> {
  return tryCatch(
    () =>
      query.query && typeof query.query === "string" && JSON.parse(query.query)
  );
}

/**
 * Extract and parse original params from internal representation
 *
 * @param {(Record<string, string | string[] | undefined>)} query
 * @returns {Option<any>}
 */
function parseParams(
  query: Record<string, string | string[] | undefined>
): Option<any> {
  return tryCatch(
    () =>
      query.params &&
      typeof query.params === "string" &&
      JSON.parse(query.params)
  );
}

/**
 * Match original url (asPath) with a provided pattern
 *
 * @param {(Record<string, string | string[] | undefined>)} query
 * @param {string} pattern
 * @returns {(Option<{
 *   values: (string | undefined)[];
 *   keys: pr.Key[];
 * }>)}
 */
function matchQuery(
  query: Record<string, string | string[] | undefined>,
  pattern: string
): Option<{
  values: (string | undefined)[];
  keys: pr.Key[];
}> {
  return matchOrNone(query.original as string, pattern);
}

/**
 * Throw in case parameters specified in pattern and in type don't match,
 * used to check both params and query
 *
 * @template Required
 * @template Optional
 * @param {(RouteSpec & { params: IntersectionType<Required, Optional> })} route
 */
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

/**
 * Throw if parameters are empty
 *
 * @template Required
 * @template Optional
 * @param {(RouteSpec & { params: IntersectionType<Required, Optional> })} route
 */
function throwIfEmptyParams<Required extends t.Props, Optional extends t.Props>(
  route: RouteSpec & { params: IntersectionType<Required, Optional> }
) {
  const params = L.flatten(route.params.types.map(p => Object.keys(p.props)));

  if (params.length === 0) {
    throw new Error(
      "parameters cannot be empty for " +
        route.pattern +
        " if you don't have params please use defR/defRQ"
    );
  }
}

/**
 * Throw if query is empty
 *
 * @template Required
 * @template Optional
 * @param {(RouteSpec & { query: IntersectionType<Required, Optional> })} route
 */
function throwIfEmptyQuery<Required extends t.Props, Optional extends t.Props>(
  route: RouteSpec & { query: IntersectionType<Required, Optional> }
) {
  const params = L.flatten(route.query.types.map(p => Object.keys(p.props)));

  if (params.length === 0) {
    throw new Error(
      "query cannot be empty for " +
        route.pattern +
        " if you don't have params please use defR/defRP"
    );
  }
}

/**
 * Define a route with both query and params specification
 *
 * @export
 * @template RequiredParams
 * @template OptionalParams
 * @template RequiredQuery
 * @template OptionalQuery
 * @param {RoutePQSpec<
 *     RequiredParams,
 *     OptionalParams,
 *     RequiredQuery,
 *     OptionalQuery
 *   >} route
 * @returns {RoutePQ<RequiredParams, OptionalParams, RequiredQuery, OptionalQuery>}
 */
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
  throwIfEmptyParams(route);
  throwIfEmptyQuery(route);

  const asPath = (params: TypeParams, query: TypeQuery) =>
    Do(option)
      .bind("qs", option.of(queryString.stringify(query, { strict: false })))
      .bind("path", generateAsPath(route.pattern, params))
      .return(s => `${s.path}?${s.qs}`)
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
          .bindL("match", s => matchQuery(s.query, route.pattern))
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
    linkTo: (params: TypeParams, query: TypeQuery, hash?: string) => ({
      as: asPath(route.params.encode(params), query) + (hash ? `#${hash}` : ""),
      href: pageUrl(route.params.encode(params), query)
    }),
    Match
  };
}

/**
 * Define a route with params specification
 *
 * @export
 * @template RequiredParams
 * @template OptionalParams
 * @param {RoutePSpec<RequiredParams, OptionalParams>} route
 * @returns {RouteP<RequiredParams, OptionalParams>}
 */
export function defRP<
  RequiredParams extends t.Props,
  OptionalParams extends t.Props
>(
  route: RoutePSpec<RequiredParams, OptionalParams>
): RouteP<RequiredParams, OptionalParams> {
  type TypeParams = t.TypeOf<typeof route.params>;

  throwIfWrongParams(route);
  throwIfEmptyParams(route);

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
          .bindL("match", s => matchQuery(s.query, route.pattern))
          .bindL("parse", s => parseParams(s.query))
          .bindL("decodedParams", s => fromEither(route.params.decode(s.parse)))
          .return(s => children(s.decodedParams))
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: (params: TypeParams, hash?: string) => ({
      as: asPath(route.params.encode(params)) + (hash ? `#${hash}` : ""),
      href: pageUrl(route.params.encode(params))
    }),
    Match
  };
}

/**
 * Define a route with query specification
 *
 * @export
 * @template RequiredQuery
 * @template OptionalQuery
 * @param {RouteQSpec<RequiredQuery, OptionalQuery>} route
 * @returns {RouteQ<RequiredQuery, OptionalQuery>}
 */
export function defRQ<
  RequiredQuery extends t.Props,
  OptionalQuery extends t.Props
>(
  route: RouteQSpec<RequiredQuery, OptionalQuery>
): RouteQ<RequiredQuery, OptionalQuery> {
  type TypeQuery = t.TypeOf<typeof route.query>;

  throwIfEmptyQuery(route);

  const asPath = (query: TypeQuery) => {
    const qs = queryString.stringify(query, { strict: false });

    return generateAsPath(route.pattern, {})
      .map(s => `${s}?${qs}`)
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
          .bindL("match", s => matchQuery(s.query, route.pattern))
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
    linkTo: (query: TypeQuery, hash?: string) => ({
      as: asPath(route.query.encode(query)) + (hash ? `#${hash}` : ""),
      href: pageUrl(route.query.encode(query))
    }),
    Match
  };
}

/**
 * Define a route with neither query nor params specification
 *
 * @export
 * @param {RouteSpec} route
 * @returns {Route}
 */
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
          .bindL("match", s => matchQuery(s.query, route.pattern))
          .return(_ => children())
          .toNullable()
      )
    );

  return {
    ...route,
    linkTo: (hash?: string) => ({
      as: asPath() + (hash ? `#${hash}` : ""),
      href: pageUrl()
    }),
    Match
  };
}
