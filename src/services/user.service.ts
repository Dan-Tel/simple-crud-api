import { users } from "../db/db";
import { User } from "../models/user.model";

export default class UserService {
  getUsers() {
    return users;
  }

  getUserById(id: string) {
    return users.find((user) => user.id === id);
  }

  createUser(user: User) {
    users.push(user);
  }

  updateUser(user: User) {
    const index = users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      users[index] = user;
    }
  }

  deleteUser(id: string) {
    const index = users.findIndex((u) => u.id === id);

    if (index !== -1) {
      users.splice(index, 1);
    }
  }
}
