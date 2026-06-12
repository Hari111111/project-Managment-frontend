import { Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "../hooks/useAppHooks";

function ProtectedRoute({ children }) {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
