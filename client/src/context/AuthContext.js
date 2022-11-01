import { createContext, useContext, useEffect, useState } from "react"
import { authAxios } from "../axios.js"

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    authAxios
      .get("/user")
      .then(res => setUser(res.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])

  const createAccount = (email, username, profilePhotoURL, password) =>
    authAxios.post("/create-account", {
      email,
      username,
      profilePhotoURL,
      password,
    })

  const login = (email, password) =>
    authAxios.post("/login", {
      email,
      password,
    })

  const loginWithEmail = email => authAxios.get(`/send-email?email=${email}`)

  const resetPassword = () => authAxios.get(`/reset-password`)

  const changePassword = (oldPassword, newPassword) =>
    authAxios.post("/change-password", { oldPassword, newPassword })

  const updateProfile = async profile => {
    try {
      const res = await authAxios.post("/update-profile", profile)
      if (res.data?.user) setUser(res.data?.user)
    } catch (e) {
      throw new Error(e)
    }
  }

  const value = {
    loading,
    user,
    createAccount,
    login,
    loginWithEmail,
    resetPassword,
    changePassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider, useAuth }
