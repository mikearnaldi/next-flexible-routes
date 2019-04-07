# Next Flexible Routes [![Build Status](https://travis-ci.org/mikearnaldi/next-flexible-routes.svg?branch=master)](https://travis-ci.org/mikearnaldi/next-flexible-routes) [![Coverage Status](https://coveralls.io/repos/github/mikearnaldi/next-flexible-routes/badge.svg?branch=master)](https://coveralls.io/github/mikearnaldi/next-flexible-routes?branch=master) [![npm version](https://img.shields.io/npm/v/next-flexible-routes.svg?style=flat)](https://www.npmjs.com/package/next-flexible-routes) 
Next Flexible Routes is a library to takle the pain of routing withing a next.js app.

We have been using alternative libraries internally at CreditSCRIPT for a while and we have fund them very easy to start with but very hard to scale.

The reason is routing maps tend to change over time and it gets progressively hard to refactor without a strictly typed environment.

We decided to takle the pain and build a library for our own usage and we ended up deciding to open-source it thinking the community could benefit from it.

## Features
* Strongly typed link generation
* Strongly typed parameters and query extraction
* Minimal API to define routes
* Maximum Flexibility on deployment
* Custom (pluggable) codec to encode parameters (Date/UUID/etc)

## Usage
Examples can be found in the [with-next-flexible-routes](./packages/with-next-flexible-routes) package

## Documentation
Please refer to [api-docs](./docs/api.md) and [middleware-docs](./docs/middleware.md)

## Installation
```bash
yarn add next-flexible-routes
```

you might need additional peer dependencies to be installed:
```
"assert": "^1.4.1",
"express": "^4.16.4",
"fp-ts": "^1.15.0",
"fp-ts-contrib": "^0.0.2",
"io-ts": "^1.8.4",
"lodash": "^4.17.11",
"monocle-ts": "^1.7.1",
"next": "^8.0.3",
"path-to-regexp": "^3.0.0",
"preact": "^8.4.2",
"query-string": "^6.4.2",
"react": "^16.8.6",
"react-dom": "^16.8.6",
"ts-node": "^8.0.3"
```

## Contributing
Pull requests are welcome. Please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Thanks
Huge thanks goes to the authors of [fp-ts](https://github.com/gcanti/fp-ts), [io-ts](https://github.com/gcanti/io-ts), [fp-ts-contrib](https://github.com/gcanti/fp-ts-contrib), [next.js](https://github.com/zeit/next.js/), and any used library