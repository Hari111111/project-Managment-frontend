import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchActivityLogs = createAsyncThunk(
  "activity/fetchActivityLogs",
  async ({ page = 1, limit = 10, q = "", action = "", entityType = "" } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (q) params.append("q", q);
      if (action) params.append("action", action);
      if (entityType) params.append("entityType", entityType);

      const response = await api.get(`/activities?${params.toString()}`);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to load activity logs");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    logs: [],
    pagination: null,
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activitySlice.reducer;
