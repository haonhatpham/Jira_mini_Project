import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { authService } from "../services/auth.service";
import type {
  AsyncStatus,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  UserRole,
} from "../types";
import { getErrorMessage } from "../utils/apiError.util";

const AUTH_STORAGE_KEY = "jira-mini-auth";

export interface AuthStoreState {
  isLoggedIn: boolean;
  username: string | null;
  role: UserRole | null;
  status: AsyncStatus;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<LoginResponse>;
  resetError: () => void;
}

export const selectIsLoggedIn = (state: AuthStoreState): boolean =>
  state.isLoggedIn;
export const selectIsAdmin = (state: AuthStoreState): boolean =>
  state.role === "admin";
export const selectUsername = (state: AuthStoreState): string | null =>
  state.username;
export const selectUserRole = (state: AuthStoreState): UserRole | null =>
  state.role;
export const selectAuthStatus = (state: AuthStoreState): AsyncStatus =>
  state.status;
export const selectAuthError = (state: AuthStoreState): string | null =>
  state.error;
export const selectLogin = (state: AuthStoreState): AuthStoreState["login"] =>
  state.login;
export const selectLogout = (state: AuthStoreState): AuthStoreState["logout"] =>
  state.logout;
export const selectRegister = (
  state: AuthStoreState,
): AuthStoreState["register"] => state.register;
export const selectResetAuthError = (
  state: AuthStoreState,
): AuthStoreState["resetError"] => state.resetError;

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: authService.hasToken(),
        username: null,
        role: null,
        status: "idle",
        error: null,

        login: async (credentials) => {
          set({ status: "loading", error: null }, false, "auth/loginPending");

          try {
            const result = await authService.login(credentials);

            set(
              {
                isLoggedIn: true,
                username: result.username,
                role: result.role,
                status: "data",
                error: null,
              },
              false,
              "auth/loginSuccess",
            );

            return result;
          } catch (err) {
            set(
              {
                status: "error",
                error: getErrorMessage(err),
              },
              false,
              "auth/loginFailure",
            );
            throw err;
          }
        },

        register: async (credentials) => {
          set({ status: "loading", error: null }, false, "auth/registerPending");

          try {
            await authService.register(credentials);
            const result = await authService.login({
              password: credentials.password,
              username: credentials.username,
            });

            set(
              {
                isLoggedIn: true,
                username: result.username,
                role: result.role,
                status: "data",
                error: null,
              },
              false,
              "auth/registerSuccess",
            );

            return result;
          } catch (err) {
            set(
              {
                status: "error",
                error: getErrorMessage(err),
              },
              false,
              "auth/registerFailure",
            );
            throw err;
          }
        },

        logout: async () => {
          await authService.logout();
          set(
            {
              isLoggedIn: false,
              username: null,
              role: null,
              status: "idle",
              error: null,
            },
            false,
            "auth/logout",
          );
        },

        resetError: () => set({ error: null }, false, "auth/resetError"),
      }),
      {
        name: AUTH_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          username: state.username,
          role: state.role,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return;

          if (!authService.hasToken()) {
            void state.logout();
          }
        },
      },
    ),
    { enabled: true, name: "AuthStore" },
  ),
);
