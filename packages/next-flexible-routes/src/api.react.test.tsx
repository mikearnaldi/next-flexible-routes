import React from "react";
import { configure, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PropTypes from "prop-types";

import { defRPQ, T, stringT, defRP } from ".";
import { dateT, numberT } from "./codecs";
import { defRQ, defR } from "./api";

configure({ adapter: new Adapter() });

describe("React API should extract params and query from router", () => {
  it("defRPQ extract both Params and Query", () => {
    const barR = defRPQ({
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

    expect(barR.linkTo({ name: "bar" }, { a: "REQ", q: "OPT" })).toEqual({
      as: "/test/bar/a?a=REQ&q=OPT",
      href:
        "/foo?params=" +
        encodeURIComponent('{"name":"bar"}') +
        "&original=" +
        encodeURIComponent("/test/bar/a?a=REQ&q=OPT") +
        "&query=" +
        encodeURIComponent('{"a":"REQ","q":"OPT"}')
    });

    expect(
      barR.linkTo({ name: "bar" }, { a: "REQ", q: "OPT" }, "hash")
    ).toEqual({
      as: "/test/bar/a?a=REQ&q=OPT#hash",
      href:
        "/foo?params=" +
        encodeURIComponent('{"name":"bar"}') +
        "&original=" +
        encodeURIComponent("/test/bar/a?a=REQ&q=OPT") +
        "&query=" +
        encodeURIComponent('{"a":"REQ","q":"OPT"}')
    });

    class RouterProvider extends React.Component {
      static childContextTypes = {
        router: PropTypes.object
      };

      getChildContext() {
        return {
          router: {
            asPath: "/test/bar/a?a=REQ&q=OPT",
            query: {
              params: '{"name":"bar"}',
              original: "/test/bar/a?a=REQ&q=OPT",
              query: '{"a":"REQ","q":"OPT"}'
            }
          }
        };
      }

      render() {
        return this.props.children;
      }
    }

    expect(
      render(
        <RouterProvider>
          <barR.Match>
            {({ name }, { a, q }) => (
              <div>
                {name}
                {a}
                {q}
              </div>
            )}
          </barR.Match>
        </RouterProvider>
      ).html()
    ).toEqual("barREQOPT");
  });

  it("defRP extract Params", () => {
    const barR = defRP({
      page: "foo",
      pattern: "/test/:dt",
      params: T.required({
        dt: dateT
      })
    });

    const dt = new Date();

    expect(barR.linkTo({ dt })).toEqual({
      as: "/test/" + encodeURIComponent(dt.toISOString()),
      href:
        "/foo?params=" +
        encodeURIComponent('{"dt":"' + dt.toISOString() + '"}') +
        "&original=" +
        encodeURIComponent("/test/" + encodeURIComponent(dt.toISOString())) +
        "&query=" +
        encodeURIComponent("{}")
    });

    expect(barR.linkTo({ dt }, "hash")).toEqual({
      as: "/test/" + encodeURIComponent(dt.toISOString()) + "#hash",
      href:
        "/foo?params=" +
        encodeURIComponent('{"dt":"' + dt.toISOString() + '"}') +
        "&original=" +
        encodeURIComponent("/test/" + encodeURIComponent(dt.toISOString())) +
        "&query=" +
        encodeURIComponent("{}")
    });

    class RouterProvider extends React.Component {
      static childContextTypes = {
        router: PropTypes.object
      };

      getChildContext() {
        return {
          router: {
            asPath: "/test/" + encodeURIComponent(dt.toISOString()),
            query: {
              params: '{"dt":"' + dt.toISOString() + '"}',
              original: "/test/" + encodeURIComponent(dt.toISOString()),
              query: "{}"
            }
          }
        };
      }

      render() {
        return this.props.children;
      }
    }

    expect(
      render(
        <RouterProvider>
          <barR.Match>{({ dt }) => <div>{dt.toISOString()}</div>}</barR.Match>
        </RouterProvider>
      ).html()
    ).toEqual(dt.toISOString());
  });

  it("defRQ extract Query", () => {
    const barR = defRQ({
      page: "foo",
      pattern: "/test",
      query: T.required({
        n: numberT
      })
    });

    const n = 10;

    expect(barR.linkTo({ n })).toEqual({
      as: "/test?n=10",
      href:
        "/foo?params=" +
        encodeURIComponent("{}") +
        "&original=" +
        encodeURIComponent("/test") +
        "&query=" +
        encodeURIComponent('{"n":"10"}')
    });

    expect(barR.linkTo({ n }, "hash")).toEqual({
      as: "/test?n=10#hash",
      href:
        "/foo?params=" +
        encodeURIComponent("{}") +
        "&original=" +
        encodeURIComponent("/test") +
        "&query=" +
        encodeURIComponent('{"n":"10"}')
    });

    class RouterProvider extends React.Component {
      static childContextTypes = {
        router: PropTypes.object
      };

      getChildContext() {
        return {
          router: {
            asPath: "/test",
            query: {
              params: "{}",
              original: "/test",
              query: '{"n":"10"}'
            }
          }
        };
      }

      render() {
        return this.props.children;
      }
    }

    expect(
      render(
        <RouterProvider>
          <barR.Match>{({ n }) => <div>{n}</div>}</barR.Match>
        </RouterProvider>
      ).html()
    ).toEqual("10");
  });

  it("defR extract nothing", () => {
    const barR = defR({
      page: "foo",
      pattern: "/test"
    });

    expect(barR.linkTo()).toEqual({
      as: "/test",
      href:
        "/foo?params=" +
        encodeURIComponent("{}") +
        "&original=" +
        encodeURIComponent("/test") +
        "&query=" +
        encodeURIComponent("{}")
    });

    expect(barR.linkTo("hash")).toEqual({
      as: "/test#hash",
      href:
        "/foo?params=" +
        encodeURIComponent("{}") +
        "&original=" +
        encodeURIComponent("/test") +
        "&query=" +
        encodeURIComponent("{}")
    });

    class RouterProvider extends React.Component {
      static childContextTypes = {
        router: PropTypes.object
      };

      getChildContext() {
        return {
          router: {
            asPath: "/test",
            query: {
              params: "{}",
              original: "/test",
              query: "{}"
            }
          }
        };
      }

      render() {
        return this.props.children;
      }
    }

    expect(
      render(
        <RouterProvider>
          <barR.Match>{() => <div>child</div>}</barR.Match>
        </RouterProvider>
      ).html()
    ).toEqual("child");
  });
});
