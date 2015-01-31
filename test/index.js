'use strict';

var sinon = require('sinon');
var code = require('code');
var lab = module.exports.lab = require('lab').script();

var expect = code.expect;
var describe = lab.describe;
var it = lab.it;

var ship = require('../lib');

describe('cargo-ship', function () {
  it('calls tasks in parallel (sync)', function (done) {
    var cranes = [
      function (cargo, done) {
        expect(cargo).to.deep.equal({});
        cargo.a = 1;
        done();
      },
      function (cargo, done) {
        expect(cargo).to.deep.equal({
          a: 1
        });
        cargo.b = 2;
        done();
      },
      function (cargo, done) {
        expect(cargo).to.deep.equal({
          a: 1,
          b: 2
        });
        cargo.a = 3;
        done();
      }
    ];

    ship.load(cranes, function (err, cargo) {
      expect(err).to.not.exist();
      expect(cargo).to.deep.equal({
        a: 3,
        b: 2
      });
      done();
    });
  });

  it('calls tasks in parallel (async)', function (done) {
    var cranes = [
      function (cargo, done) {
        cargo.a = 1;
        process.nextTick(done);
      },
      function (cargo, done) {
        cargo.b = 2;
        process.nextTick(done);
      },
      function (cargo, done) {
        cargo.c = 3;
        process.nextTick(done);
      }
    ];

    ship.load(cranes, function (err, cargo) {
      expect(err).to.not.exist();
      expect(cargo).to.deep.equal({
        a: 1,
        b: 2,
        c: 3
      });
      done();
    });
  });

  it('finishes with no tasks', function (done) {
    ship.load([], function (err, cargo) {
      expect(err).to.not.exist();
      expect(cargo).to.deep.equal({});
      done();
    });
  });

  it('can receive a cargo from the outside', function (done) {
    var cranes = [
      function (cargo, done) {
        expect(cargo).to.deep.equal({
          c: 3
        });
        cargo.a = 1;
        done();
      },
      function (cargo, done) {
        cargo.b = 2;
        done();
      }
    ];

    ship.load(cranes, { c: 3 }, function (err, cargo) {
      expect(err).to.not.exist();
      expect(cargo).to.deep.equal({
        a: 1,
        b: 2,
        c: 3
      });
      done();
    });
  });

  it('aborts with error (sync)', function (done) {
    var errInstance = new Error();
    var spy = sinon.spy(function (baton, next) {
      next();
    });

    var cranes = [
      function (cargo, done) {
        done(errInstance);
      },
      spy
    ];

    ship.load(cranes, function (err, cargo) {
      expect(err).to.equal(errInstance);
      expect(cargo).to.be.undefined();
      expect(spy.callCount).to.equal(0);
      done();
    });
  });

  it('aborts with error (async)', function (done) {
    var errInstance = new Error();
    var errInstance2 = new Error();

    var spyCrane = sinon.spy(function (baton, next) {
      next(errInstance);
    });

    var cranes = [
      function (cargo, done) {
        process.nextTick(function () {
          done(errInstance2);
        });
      },
      spyCrane
    ];

    ship.load(cranes, function (err, cargo) {
      expect(err).to.equal(errInstance);
      expect(cargo).to.be.undefined();
      expect(spyCrane.callCount).to.equal(1);
      done();
    });
  });
});