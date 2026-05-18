import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import type { AuthUser, LoginCredentials, LoginResponse } from "../types";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/authToken.util";

export const authService = {
  hasToken(): boolean {
    return Boolean(getStoredToken());
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.get<AuthUser[]>(API_PATHS.AUTH.USERS);

    const user = data.find(
      (item) =>
        item.username === credentials.username &&
        item.password === credentials.password,
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    setStoredToken(user.token);

    return {
      token: user.token,
      username: user.username,
    };
  },

  logout(): void {
    clearStoredToken();
  },
};
