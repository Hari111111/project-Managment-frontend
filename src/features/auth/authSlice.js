import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";

const storedToken = localStorage.getItem("pms_token");
const storedUser = localStorage.getItem("pms_user");

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, thunkApi) => {
    try {
      const response = await api.post("/auth/login", payload);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const setupAdmin = createAsyncThunk(
  "auth/setupAdmin",
  async (payload, thunkApi) => {
    try {
      const response = await api.post("/auth/setup-admin", payload);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Setup failed",
      );
    }
  },
);

const persistSession = (token, user) => {
  localStorage.setItem("pms_token", token);
  localStorage.setItem("pms_user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("pms_token");
  localStorage.removeItem("pms_user");
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || "",
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: "",
  },
  reducers: {
    restoreSession: (state) => {
      state.token = localStorage.getItem("pms_token") || "";
      state.user = JSON.parse(localStorage.getItem("pms_user") || "null");
    },
    logout: (state) => {
      clearSession();
      state.token = "";
      state.user = null;
      state.error = "";
    },
    updateCurrentUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("pms_user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setupAdmin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(setupAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistSession(action.payload.token, action.payload.user);
      })
      .addCase(setupAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreSession, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
