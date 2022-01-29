const { signUp } = require("./users");
const request = require("supertest");
const app = require("../../app");

describe("Post Endpoints", () => {
  it("should create a new post", async () => {
    const res = await request(app).post("/api/users/signup").send({
      email: "spercorep@gmail.com",
      password: "1234",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toEqual({
      email: expect.any(String),
      message: expect.any(String),
      token: expect.any(String),
    });
  });
});
