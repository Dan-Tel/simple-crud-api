import { IncomingMessage, ServerResponse } from "node:http";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import UserService from "../services/user.service";
import { response } from "../utils/response";
import { isUserValid } from "../utils/isUserValid";
import { getRequestBody } from "../utils/getRequestBody";
import { User } from "../models/user.model";

const userService = new UserService();

export const getUsersController = (
  _req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const users = userService.getUsers();

    response(res, { data: users });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    response(res, { status: 500, data: { message: errorMessage } });
  }
};

export const getUserByIdController = async (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    if (!uuidValidate(id)) {
      response(res, { status: 400, data: { message: "id is not uuid" } });
      return;
    }

    const user = userService.getUserById(id);

    if (user) {
      response(res, { data: user });
    } else {
      response(res, { status: 404, data: { message: "user not found" } });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    response(res, { status: 500, data: { message: errorMessage } });
  }
};

export const createUserController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const user = await getRequestBody<User>(req);

    if (isUserValid(user)) {
      const newUser = {
        id: uuidv4(),
        ...user,
      };
      await userService.createUser(newUser);
      response(res, {
        status: 201,
        data: newUser,
      });
    } else {
      response(res, {
        status: 400,
        data: { message: "request body does not contain required fields" },
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    response(res, { status: 500, data: { message: errorMessage } });
  }
};

export const updateUserController = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    if (!uuidValidate(id)) {
      response(res, { status: 400, data: { message: "id is not uuid" } });
      return;
    }

    const user = await getRequestBody<User>(req);
    const users = userService.getUsers();

    const doesUserExist = !!users.find((user) => user.id === id);

    if (isUserValid(user) && doesUserExist) {
      const newUser = {
        id,
        ...user,
      };
      userService.updateUser(newUser);

      response(res, { data: newUser });
    } else {
      response(res, { status: 404, data: { message: "user was not found" } });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    response(res, { status: 500, data: { message: errorMessage } });
  }
};

export const deleteUserController = (
  _req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    if (!uuidValidate(id)) {
      response(res, { status: 400, data: { message: "id is not uuid" } });
      return;
    }

    const users = userService.getUsers();

    const doesUserExist = users.find((user) => user.id === id);

    if (doesUserExist) {
      userService.deleteUser(id);
      response(res, {
        status: 204,
        data: { message: "user deleted successfully" },
      });
    } else {
      response(res, { status: 404, data: { message: "user was not found" } });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    response(res, { status: 500, data: { message: errorMessage } });
  }
};
