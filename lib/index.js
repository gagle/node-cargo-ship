'use strict';

exports.load = function (cranes, cargo, cb) {
  if (arguments.length === 2) {
    cb = cargo;
    cargo = {};
  }

  var len = cranes.length;
  var remaining = len;
  if (!len) return cb(null, cargo);

  var done = function (err) {
    if (errored) return;

    if (err) {
      errored = true;
      return cb(err);
    }

    if (!--remaining) return cb(null, cargo);
  };

  var errored = false;

  for (var i = 0; !errored && i < len; i++) {
    cranes[i](cargo, done);
  }
};