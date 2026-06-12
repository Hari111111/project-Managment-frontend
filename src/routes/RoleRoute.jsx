import { Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/useAppHooks";

function RoleRoute({ children, roles }) {
  const { user } = useAppSelector((state) => state.auth);

  if (!roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;
