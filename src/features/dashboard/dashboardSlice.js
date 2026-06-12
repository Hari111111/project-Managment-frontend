import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";

export const fetchDashboard = createAsyncThunk("dashboard/fetchDashboard", async (_, thunkApi) => {
  try {
    const response = await api.get("/dashboard");
    return response.data.analytics;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to load dashboard");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    analytics: null,
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
