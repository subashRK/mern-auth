import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"

const ChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const { resetPassword, changePassword, user } = useAuth()

  const handleChangePassword = async e => {
    e.preventDefault()

    if (!oldPassword?.trim() || !newPassword.trim())
      return setMessage({
        msg: "Please enter all the password fields!",
        error: true,
      })
    if (confirmNewPassword !== newPassword)
      return setMessage({
        msg: "New Password doesn't match confirm password!",
        error: true,
      })
    if (oldPassword === newPassword)
      return setMessage({
        msg: "Please enter a different new password!",
        error: true,
      })

    setLoading(true)
    setMessage(null)

    try {
      await changePassword(oldPassword, newPassword)
      setMessage({
        msg: "Succesfully changed your password!",
      })
    } catch (e) {
      setMessage({
        msg: e?.response?.data || "Something went wrong!",
        error: true,
      })
    } finally {
      setOldPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await resetPassword()
      setMessage({
        msg: (
          <p>
            We have sent an email to <b>{user.email}</b>. You can find the new
            password. With that password you can now change the password.
          </p>
        ),
      })
    } catch (e) {
      setMessage({
        msg: e?.response?.data || "Something went wrong!",
        error: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <Form
        className="bg-white rounded-1 shadow-sm p-3 my-5"
        style={{ width: "80%", maxWidth: 500 }}
        onSubmit={handleChangePassword}
      >
        <h1>Change Password</h1>
        <hr />
        {message && (
          <Alert
            variant={message.error ? "danger" : "info"}
            className="text-break"
          >
            {message.msg}
          </Alert>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>
            Please enter your old password, so that we can verify its you.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>Please enter a new password.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>Please confirm your new password.</Form.Text>
        </Form.Group>
        <hr />
        <Button type="submit" className="w-100 mb-1" disabled={loading}>
          Update Password
        </Button>
        <Button
          className="w-100"
          disabled={loading}
          onClick={handleResetPassword}
          variant="secondary"
        >
          Reset Password
        </Button>
      </Form>
    </div>
  )
}

export default ChangePassword
