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

describe("Valid input handling", () => {
  it("GET /users should return an empty array", async () => {
    const response = await request(server).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("POST /users should create a new user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };

    const response = await request(server).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("John");
  });

  it("GET /users/:id should return a user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };

    const createResponse = await request(server)
      .post("/api/users")
      .send(newUser);
    const userId = createResponse.body.id;

    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("John");
  });

  it("PUT /users/:id should update a user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };

    const createResponse = await request(server)
      .post("/api/users")
      .send(newUser);
    const userId = createResponse.body.id;

    const updatedUser = {
      username: "John Updated",
      age: 31,
      hobbies: ["reading", "travelling"],
    };
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("John Updated");
  });

  it("DELETE /users/:id should delete a user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };
    const createResponse = await request(server)
      .post("/api/users")
      .send(newUser);
    const userId = createResponse.body.id;

    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(server).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
