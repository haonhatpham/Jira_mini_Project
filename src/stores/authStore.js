import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { setUnauthorizedHandler } from "../api/axiosInstance";
import { authService } from "../services/auth.service";
import { getErrorMessage } from "../utils/apiError.util";

const AUTH_STORAGE_KEY = "jira-mini-auth";

export const selectIsLoggedIn = (state) => state.isLoggedIn;
export const selectUsername = (state) => state.username;
export const selectAuthStatus = (state) => state.status;
export const selectAuthError = (state) => state.error;
export const selectLogin = (state) => state.login;
export const selectLogout = (state) => state.logout;
export const selectResetAuthError = (state) => state.resetError;

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: authService.hasToken(),
        username: null,
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

        logout: () => {
          authService.logout();
          set(
            {
              isLoggedIn: false,
              username: null,
              status: "idle",
              error: null,
            },
            false,
            "auth/logout",
          );
        },

        handleUnauthorized: () =>
          set(
            {
              isLoggedIn: false,
              username: null,
              status: "idle",
              error: null,
            },
            false,
            "auth/unauthorized",
          ),

        resetError: () => set({ error: null }, false, "auth/resetError"),
      }),
      {
        name: AUTH_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ username: state.username }),
      },
    ),
    { enabled: true, name: "AuthStore" },
  ),
);

setUnauthorizedHandler(() => {
  useAuthStore.getState().handleUnauthorized();
});
