"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdminOrCorrectUser,
  ensureAdmin,
} = require("./auth");

const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

describe("authenticateJWT", function () {
  test("works: via header", function () {
    // expect.assertions(2);
    const spyFunction1 = jest.fn();

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    // const res = { locals: {} };
    req.locals = req.locals || {};

    const next = function (err) {
      // expect(err).toBeFalsy();
      spyFunction1();
    };
    authenticateJWT(req, {}, next);
    expect(req.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
    expect(spyFunction1).toHaveBeenCalled();
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = { locals: {} };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(req.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` }, locals: {} };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(req.locals).toEqual({});
  });
});

describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = { locals: { user: { username: "test", isAdmin: false } } };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = { locals: {} };
    const res = {};
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe("ensureAdmin", function () {
  test("works", function () {
    expect.assertions(1);
    const req = { locals: { user: { username: "test", isAdmin: true } } };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("fail: not login", function () {
    expect.assertions(1);
    const req = { locals: {} };
    const res = {};
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });

  test("fail: user not admin", function () {
    expect.assertions(1);
    const req = { locals: { user: { username: "test", isAdmin: false } } };
    const res = {};
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});

describe("ensureAdminOrCorrectUser", function () {
  test("works admin", function () {
    expect.assertions(1);
    const req = {
      params: { username: "test" },
      locals: { user: { username: "test", isAdmin: true } },
    };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test("works not admin but correct user", function () {
    expect.assertions(1);
    const req = {
      params: { username: "test" },
      locals: { user: { username: "test", isAdmin: false } },
    };
    const res = {};
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test("fail if not admin/wrong user", function () {
    expect.assertions(1);
    const req = {
      params: { username: "wrong" },
      locals: { user: { username: "test", isAdmin: false } },
    };
    const res = {};
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });

  test("fail if not login", function () {
    expect.assertions(1);
    const req = { params: { username: "test" }, locals: {} };
    const res = {};
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrCorrectUser(req, res, next);
  });
});
