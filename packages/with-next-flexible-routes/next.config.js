const withTypescript = require("@zeit/next-typescript");

module.exports = withTypescript(
  process.env.BUILD_TARGET === "serverless"
    ? {
        webpack: config => {
          config.node = {
            fs: "empty"
          };

          return config;
        },
        target: process.env.BUILD_TARGET
      }
    : {
        webpack: config => {
          config.node = {
            fs: "empty"
          };

          return config;
        }
      }
);
