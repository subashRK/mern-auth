import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const { login, loginWithEmail } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()

    setLoading(true)
    setMessage(null)

    try {
      await login(email, password)
    } catch (e) {
      setMessage({
        msg:
          e.response.status !== 404
            ? e.response?.data || "Something went wrong!"
            : "Something went wrong!",
        error: true,
      })
    } finally {
      window.scrollTo(0, 0)
      setPassword("")
      setLoading(false)
    }
  }

  const handleLoginWithEmail = async () => {
    if (email?.trim() === "") {
      return setMessage({
        msg: "Please enter the email address of your account!",
        error: true,
      })
    }

    setLoading(true)
    setMessage(null)

    try {
      await loginWithEmail(email, password)

      setMessage({
        msg: (
          <p>
            We have sent an email to <b>{email}</b>. You can find a link in that
            email. Please use that link to login.
          </p>
        ),
      })
    } catch (e) {
      setMessage({
        msg:
          e.response.status !== 404
            ? e.response?.data || "Something went wrong!"
            : "Something went wrong!",
        error: true,
      })
    } finally {
      window.scrollTo(0, 0)
      setPassword("")
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <Form
        className="bg-white rounded-1 shadow-sm p-3 my-5"
        onSubmit={handleSubmit}
        style={{ width: "80%", maxWidth: 500 }}
      >
        <h1>Create Account</h1>
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
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            placeholder="eg: abc@email.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>Please enter your email address.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="eg: ls893_2-2LKsacy92!"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>Please enter your password.</Form.Text>
        </Form.Group>
        <hr />
        <Button type="submit" className="w-100 mb-1" disabled={loading}>
          Login
        </Button>
        <Button
          onClick={handleLoginWithEmail}
          variant="secondary"
          className="w-100"
          disabled={loading}
        >
          Login with email
        </Button>
        <span
          className="d-block text-center mx-auto mt-2"
          style={{ width: "fit-content" }}
        >
          Don't have an account? <Link to="/signup">Signup</Link>
        </span>
      </Form>
    </div>
  )
}

export default Login
