import { IncomingMessage, ServerResponse } from "node:http";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from "../controllers/user.controller";

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method;
  const url = req.url;

  if (!url) return;
  const [context, resource, id] = url.split("/").slice(1);
  const endpoint = `/${context}/${resource}`;

  if (method === "GET" && endpoint === "/api/users") {
    if (id) {
      return getUserByIdController(req, res, id);
    }

    return getUsersController(req, res);
  }

  if (method === "POST" && endpoint === "/api/users") {
    return createUserController(req, res);
  }

  if (method === "PUT" && endpoint === "/api/users" && id) {
    return updateUserController(req, res, id);
  }

  if (method === "DELETE" && endpoint === "/api/users" && id) {
    return deleteUserController(req, res, id);
  }

  res.writeHead(404, { "Content-type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found" }));
};
