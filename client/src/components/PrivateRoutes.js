import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoutes({ authRequired }) {
  const { user } = useAuth()

  return authRequired ? (
    user ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    )
  ) : !user ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

export default PrivateRoutes
