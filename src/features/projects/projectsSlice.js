import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../services/api";

export const fetchProjects = createAsyncThunk("projects/fetchProjects", async (_, thunkApi) => {
  try {
    const response = await api.get("/projects");
    return response.data.projects;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to load projects");
  }
});

export const fetchProjectById = createAsyncThunk("projects/fetchProjectById", async (projectId, thunkApi) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data.project;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to load project");
  }
});

export const createProject = createAsyncThunk("projects/createProject", async (formData, thunkApi) => {
  try {
    const response = await api.post("/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.project;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to create project");
  }
});

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, formData }, thunkApi) => {
    try {
      const response = await api.put(`/projects/${projectId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.project;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to update project");
    }
  }
);

export const deleteProject = createAsyncThunk("projects/deleteProject", async (projectId, thunkApi) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return projectId;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to delete project");
  }
});

export const updateProjectStatus = createAsyncThunk(
  "projects/updateProjectStatus",
  async ({ projectId, payload }, thunkApi) => {
    try {
      const response = await api.patch(`/projects/${projectId}/status`, payload);
      return response.data.project;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    selectedProject: null,
    loading: false,
    error: "",
    actionLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedProject = action.payload;
        state.items = state.items.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((project) => project._id !== action.payload);
        if (state.selectedProject?._id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(updateProjectStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedProject = action.payload;
        state.items = state.items.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;
