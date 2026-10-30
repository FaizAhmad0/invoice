import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, beforeEach, describe, it } from "node:test";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "auth-cookie-regression-test-secret";

const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/utils/jwt.js");

describe("JWT cookie authentication after login and refresh", () => {
  let server;
  let baseUrl;
  let storedUser;
  const originalFindOne = User.collection.findOne;

  before(async () => {
    // Substitute only MongoDB IO, preserving Mongoose queries and defaults.
    User.collection.findOne = async (filter) => {
      if (!storedUser) return null;
      if (filter.uid !== undefined && filter.uid !== storedUser.uid) return null;
      if (filter._id && !filter._id.equals(storedUser._id)) return null;
      return { ...storedUser, platforms: [...storedUser.platforms] };
    };

    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/auth`;
  });

  beforeEach(() => {
    // Existing database accounts may predate the tokenVersion schema field.
    storedUser = {
      _id: new mongoose.Types.ObjectId(),
      uid: 987654,
      name: "Refresh test account",
      email: "refresh@example.test",
      password: "test-password",
      role: "user",
      platforms: [],
    };
  });

  after(async () => {
    User.collection.findOne = originalFindOne;
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
      });
    }
  });

  async function loginCookie() {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: "UID987654", password: "test-password" }),
    });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.id, storedUser._id.toString());
    const cookie = response.headers.getSetCookie().find((value) => value.startsWith("token="));
    assert.ok(cookie, "login must set a JWT cookie");
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Max-Age=/i);
    return cookie.split(";")[0];
  }

  async function currentUser(cookie) {
    const response = await fetch(`${baseUrl}/me`, {
      headers: cookie ? { Cookie: cookie } : {},
    });
    return { status: response.status, body: await response.json() };
  }

  it("restores an older account using only the cookie after repeated refreshes", async () => {
    const cookie = await loginCookie();
    assert.equal(Object.hasOwn(storedUser, "tokenVersion"), false);

    for (let refresh = 0; refresh < 3; refresh++) {
      const result = await currentUser(cookie);
      assert.equal(result.status, 200, JSON.stringify(result.body));
      assert.equal(result.body.data.id, storedUser._id.toString());
      assert.equal(result.body.data.role, "user");
      assert.equal(Object.hasOwn(result.body.data, "password"), false);
      assert.equal(Object.hasOwn(result.body.data, "tokenVersion"), false);
    }
  });

  it("continues to authenticate accounts with an explicitly stored token version", async () => {
    storedUser.tokenVersion = 4;
    const cookie = await loginCookie();
    assert.equal((await currentUser(cookie)).status, 200);
  });

  it("rejects the old cookie after its token version is revoked", async () => {
    const cookie = await loginCookie();
    storedUser.tokenVersion = 1;
    assert.equal((await currentUser(cookie)).status, 401);
  });

  it("rejects a token that omits its version", async () => {
    const token = signToken({ id: storedUser._id.toString(), role: "user" });
    assert.equal((await currentUser(`token=${token}`)).status, 401);
  });

  it("rejects missing or invalid cookies", async () => {
    assert.equal((await currentUser()).status, 401);
    assert.equal((await currentUser("token=invalid-token")).status, 401);
  });
});
