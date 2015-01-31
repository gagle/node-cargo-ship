'use strict';

module.exports = function (baton, next) {
  baton.c = 3;
  next();
};