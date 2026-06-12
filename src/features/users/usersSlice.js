import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";
import { updateCurrentUser } from "../auth/authSlice";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, thunkApi) => {
  try {
    const response = await api.get("/users");
    return response.data.users;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to load users");
  }
});

export const createUser = createAsyncThunk("users/createUser", async (payload, thunkApi) => {
  try {
    const response = await api.post("/users", payload);
    return response.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to create user");
  }
});

export const updateUser = createAsyncThunk("users/updateUser", async ({ userId, payload }, thunkApi) => {
  try {
    const response = await api.put(`/users/${userId}`, payload);
    return response.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to update user");
  }
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId, thunkApi) => {
  try {
    await api.delete(`/users/${userId}`);
    return userId;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

export const updateProfile = createAsyncThunk("users/updateProfile", async (payload, thunkApi) => {
  try {
    const config = {};
    // Only set Content-Type if payload is FormData (axios will auto-set it with boundary)
    if (!(payload instanceof FormData)) {
      config.headers = { "Content-Type": "application/json" };
    }
    const response = await api.put("/users/profile", payload, config);
    thunkApi.dispatch(updateCurrentUser(response.data.user));
    return response.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    actionLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.map((user) => (user._id === action.payload._id ? action.payload : user));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user._id !== action.payload);
      })
      .addCase(updateProfile.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
