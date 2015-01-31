'use strict';

var race = require('../../lib');

race.start(require('./modules').map(function (name) {
  return require('./modules/' + name);
}), function (err, baton) {
  if (err) return console.error(err);
  console.log(baton);
  // { a: 1, b: 2, c: 3 }
});