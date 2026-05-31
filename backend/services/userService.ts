/**
 * File service user: doc user noi bo va map sang public user an password.
 */
import * as userModel from "../models/userModel.js";
import { toPublicUser, type PublicUser } from "../types/user.js";

/**
 * Lay tat ca user va loai bo password hash truoc khi tra response.
 */
export async function getUsers(): Promise<PublicUser[]> {
  const users = await userModel.findAllUsers();
  return users.map(toPublicUser);
}
