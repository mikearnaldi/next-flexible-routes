import React from "react";
import { configure, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PropTypes from "prop-types";

import { defRPQ, T, stringT } from ".";

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
});
