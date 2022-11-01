import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const UpdateProfile = () => {
  const { user, updateProfile } = useAuth()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState(user?.username || "")
  const [profilePhotoURL, setProfilePhotoURL] = useState(
    user?.profilePhotoURL || ""
  )
  const [bio, setBio] = useState(user?.bio || "")

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await updateProfile({ username, profilePhotoURL, bio })
      setMessage({ msg: "Successfully updated your profile!" })
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
      setLoading(false)
    }
  }

  return (
    <div className="center">
      <Form
        className="bg-white rounded-1 shadow-sm p-3 my-5"
        style={{ width: "80%", maxWidth: 500 }}
        onSubmit={handleSubmit}
      >
        <h1>Update Profile</h1>
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
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
          <Form.Text>Please enter your desired username.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile Picture (as URL)</Form.Label>
          <Form.Control
            type="text"
            value={profilePhotoURL}
            onChange={e => setProfilePhotoURL(e.target.value)}
            disabled={loading}
          />
          <Form.Text>
            Please enter the url of the photo that you wish to set as your
            profile picture.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            type="password"
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={loading}
          />
          <Form.Text>Please enter about you.</Form.Text>
        </Form.Group>
        <hr />
        <Button type="submit" className="w-100 mb-1" disabled={loading}>
          Update Profile
        </Button>
        <Button
          className="w-100"
          disabled={loading}
          variant="secondary"
          as={Link}
          to="/change-password"
        >
          Change Password
        </Button>
      </Form>
    </div>
  )
}

export default UpdateProfile
