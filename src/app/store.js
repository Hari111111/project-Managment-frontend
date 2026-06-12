import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import projectsReducer from "../features/projects/projectsSlice";
import usersReducer from "../features/users/usersSlice";
import activityReducer from "../features/activity/activitySlice";
import notificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    projects: projectsReducer,
    users: usersReducer,
    activity: activityReducer,
    notifications: notificationReducer,
  },
});
