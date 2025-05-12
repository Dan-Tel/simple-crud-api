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

describe("Invalid input and error handling", () => {
  it("GET /users/:id with invalid UUID should return 400", async () => {
    const response = await request(server).get("/api/users/invalid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("id is not uuid");
  });

  it("POST /users with missing required fields should return 400", async () => {
    const invalidUser = { username: "John" };

    const response = await request(server).post("/api/users").send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "request body does not contain required fields"
    );
  });

  it("PUT /users/:id with invalid UUID should return 400", async () => {
    const response = await request(server)
      .put("/api/users/invalid-uuid")
      .send({
        username: "Updated",
        age: 35,
        hobbies: ["coding"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("id is not uuid");
  });

  it("DELETE /users/:id with invalid UUID should return 400", async () => {
    const response = await request(server).delete("/api/users/invalid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("id is not uuid");
  });

  it("GET /users/:id for non-existent user should return 404", async () => {
    const response = await request(server).get(
      "/api/users/79f8aced-f90e-406b-a81e-ffaacf009665"
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("user not found");
  });
});
