// app/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "FRO" | "FRL";

interface AuthState {
  userId: string | null;
  token: string | null;
  role: UserRole | null;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;

  // ✅ NEW
  antiforgeryToken: string | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  role: null,
  userName: null,
  firstName: null,
  lastName: null,

  antiforgeryToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{
        id: string;
        userName: string;
        bearerToken: string;
        role: UserRole;
        firstName?: string | null;
        lastName?: string | null;

        // ✅ NEW
        antiforgeryToken?: string | null;
      }>
    ) {
      state.userId = action.payload.id;
      state.token = action.payload.bearerToken;
      state.role = action.payload.role;
      state.userName = action.payload.userName;
      state.firstName = action.payload.firstName ?? null;
      state.lastName = action.payload.lastName ?? null;

      // ✅ STORE ANTIFORGERY
      state.antiforgeryToken =
        action.payload.antiforgeryToken ?? null;
    },

    logout(state) {
      state.userId = null;
      state.token = null;
      state.role = null;
      state.userName = null;
      state.firstName = null;
      state.lastName = null;
      state.antiforgeryToken = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
