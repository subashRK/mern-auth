import "./App.css"
import { useAuth } from "./context/AuthContext"
import { Spinner } from "react-bootstrap"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import PrivateRoutes from "./components/PrivateRoutes"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Profile from "./components/Profile"
import ChangePassword from "./components/ChangePassword"
import UpdateProfile from "./components/UpdateProfile"

function App() {
  const { loading } = useAuth()

  return (
    <BrowserRouter>
      {loading ? (
        <div className="center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<PrivateRoutes authRequired />}>
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="update-profile" element={<UpdateProfile />} />
          </Route>
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
