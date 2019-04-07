module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["next/babel", "@zeit/next-typescript/babel"]
  };
};
