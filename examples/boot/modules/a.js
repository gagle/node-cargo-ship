'use strict';

module.exports = function (baton, next) {
  baton.a = 1;
  next();
};