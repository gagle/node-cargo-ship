cargo-ship
==========

#### Parallel execution of tasks with a shared namespace ####

[![npm version][npm-version-image]][npm-url]
[![Travis][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

The extremly well-known parallel execution of tasks, but with a cargo, a shared object where tasks can store data. It's like a cargo ship, cranes (tasks) storing data (cargo). Each task writing to the shared object.

It's very useful when you need to call a series of functions in parallel and store the data in a common place.

```javascript
var cranes = [
  function (cargo, done) {
    cargo.a = 1;
    done();
  },
  function (cargo, done) {
    cargo.b = 2;
    done();
  },
  function (cargo, done) {
    cargo.c = 3;
    done();
  }
];

ship.load(cranes, function (err, cargo) {
  // cargo { a: 1, b: 2, c: 3 }
});
```

It's basically the same behaviour as the `async.parallel()` with with a slightly and sightly! interface.

___module_.load(cranes[, cargo], callback) : undefined__  
Executes all tasks in parallel.

`cranes` is an array of functions to run in parallel. Each function has the signature `function(cargo, done)`, where `cargo` is the shared object and `done` the function to call when the task finishes. As usual, pass an error to `done()` to abort the execution of the tasks. This is the error returned by the `load()` function. Because aborting asynchronous parallel tasks is not possible once they begin, the callback is guaranteed to be called only once with the first error occurred.

A `cargo` can be passed from outside. Use the second parameter to initialize the cargo with data.

```javascript
var cranes = [
  function (cargo, done) {
    cargo.b = 2;
    done();
  },
  function (cargo, done) {
    cargo.c = 3;
    done();
  }
];

ship.load(cranes, { a: 1 }, function (err, cargo) {
  // cargo { a: 1, b: 2, c: 3 }
});
```

[npm-version-image]: https://img.shields.io/npm/v/cargo-ship.svg?style=flat
[npm-url]: https://npmjs.org/package/cargo-ship
[travis-image]: https://img.shields.io/travis/gagle/node-cargo-ship.svg?style=flat
[travis-url]: https://travis-ci.org/gagle/node-cargo-ship
[coveralls-image]: https://img.shields.io/coveralls/gagle/node-cargo-ship.svg?style=flat
[coveralls-url]: https://coveralls.io/r/gagle/node-cargo-ship