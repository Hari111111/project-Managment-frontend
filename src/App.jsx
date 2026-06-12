import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSocket } from "./hooks/useSocket";
import { useAppSelector } from "./hooks/useAppHooks";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  useSocket(); // Initialize socket connection
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              user?.role === "Admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/projects" replace />
              )
            }
          />
          <Route
            path="dashboard"
            element={
              <RoleRoute roles={["Admin"]}>
                <DashboardPage />
              </RoleRoute>
            }
          />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route
            path="projects/create"
            element={
              <RoleRoute roles={["Admin"]}>
                <CreateProjectPage />
              </RoleRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleRoute roles={["Admin"]}>
                <UserManagementPage />
              </RoleRoute>
            }
          />
          <Route
            path="activities"
            element={
              <RoleRoute roles={["Admin"]}>
                <ActivityLogsPage />
              </RoleRoute>
            }
          />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
