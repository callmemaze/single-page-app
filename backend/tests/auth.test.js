// tests/auth.test.js

import request from "supertest";
import app from "../index.js";
import { expect } from "chai";

describe("POST /auth/signin", function () {
  it("should return 200 OK and Login Success message", function (done) {
    request(app)
      .post("/auth/signin")
      .send({ email: "test@test.com", password: "test" })
      .expect("Content-Type", /application\/json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal("Login Success");
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
