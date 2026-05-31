import api from "../api/axiosInstance";
import { API_PATHS } from "../api/paths";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "../types";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../utils/authToken.util";

export const authService = {
  hasToken(): boolean {
    return Boolean(getStoredToken());
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      API_PATHS.AUTH.REGISTER,
      credentials,
    );
    return data;
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      API_PATHS.AUTH.LOGIN,
      credentials,
    );

    setStoredToken(data.token);
    return {
      token: data.token,
      expiresIn: data.expiresIn,
      username: data.username,
      role: data.role,
    };
  },

  async logout(): Promise<void> {
    if (!getStoredToken()) {
      clearStoredToken();
      return;
    }

    try {
      await api.post(API_PATHS.AUTH.LOGOUT);
    } catch {
      // Logout is stateless; clearing the local token is enough even if API is unavailable.
    } finally {
      clearStoredToken();
    }
  },
};
