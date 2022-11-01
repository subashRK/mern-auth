import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

function Signup() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [profilePhotoURL, setProfilePhotoURL] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const { createAccount } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()

    if (confirmPassword !== password) {
      setMessage({
        msg: "Please enter the correct password in the confirm password field!",
        error: true,
      })
      return window.scrollTo(0, 0)
    }

    setLoading(true)
    setMessage(null)

    try {
      await createAccount(email, username, profilePhotoURL, password)
      setMessage({
        msg: (
          <p>
            Succesfully created an account! We have sent an email to{" "}
            <b>{email}</b>. You can find a link in that email. Please use that
            link to verify your account.
          </p>
        ),
        error: false,
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
      setConfirmPassword("")
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
          <Form.Text>
            Please enter your email address. The email address you type above
            will be used to create your account.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="eg: abc123"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
          <Form.Text>
            Please choose a username. This field is not required
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile Photo URL</Form.Label>
          <Form.Control
            placeholder="eg: https://photos.com/my-photo"
            type="text"
            value={profilePhotoURL}
            onChange={e => setProfilePhotoURL(e.target.value)}
            disabled={loading}
          />
          <Form.Text>
            Please paste the URL of the photo you wish to keep as the profile
            picture. This field is not required. "You can only enter URL".
          </Form.Text>
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
          <Form.Text>Please enter a strong password.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            placeholder="Renter your password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <Form.Text>Confirm your password by rentering.</Form.Text>
        </Form.Group>
        <hr />
        <Button type="submit" className="w-100" disabled={loading}>
          Create Account
        </Button>
        <span
          className="d-block text-center mx-auto mt-2"
          style={{ width: "fit-content" }}
        >
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </Form>
    </div>
  )
}

export default Signup
