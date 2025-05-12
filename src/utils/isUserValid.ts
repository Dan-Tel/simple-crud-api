import { User } from "../models/user.model";

export const isUserValid = (user: unknown): user is User => {
  const { username, age, hobbies } = user as Record<string, unknown>;

  if (
    !username ||
    !age ||
    !hobbies ||
    typeof user !== "object" ||
    typeof username !== "string" ||
    typeof age !== "number" ||
    Array.isArray(hobbies) ||
    Object.keys(user || {}).length !== 3
  ) {
    return false;
  }

  return true;
};
