'use strict';

module.exports = function (baton, next) {
  baton.b = 2;
  next();
};