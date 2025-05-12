import request from "supertest";
import http from "node:http";
import { userRouter } from "../routes/user.routes";

let server: http.Server;

beforeAll(() => {
  server = http.createServer(userRouter);
  server.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe("Non-existing routes and server errors", () => {
  it("GET /nonexistent should return 404", async () => {
    const response = await request(server).get("/api/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not Found");
  });

  it("POST /users with invalid JSON should return 500", async () => {
    const invalidJson = "invalid json string";

    const response = await request(server)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send(invalidJson);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Unexpected token 'i', \"${invalidJson}\" is not valid JSON`
    );
  });
});
