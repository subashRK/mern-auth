import { Button, Image } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="center p-3">
      <div
        className="bg-white rounded-1 shadow-sm p-3 my-5"
        style={{ width: "80%", maxWidth: 500 }}
      >
        <h1>Profile</h1>
        <hr />
        <div
          className="d-flex align-items-center justify-content-around"
          style={{ gap: 7 }}
        >
          <Image
            width={50}
            height={50}
            roundedCircle
            src={user?.photoURL || "user-profile.jpg"}
            alt={`${user?.username || user.email}'s Profile`}
            style={{ objectFit: "cover" }}
          />
          <div className="text-break">
            <h2 className="fs-5 m-0">{user.email}</h2>
            {user?.username && (
              <h3 className="fs-6 fw-normal m-0">{user.username}</h3>
            )}
          </div>
        </div>
        <hr />
        <div className="mx-4 mt-3 text-break">
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
        </div>

        <Button className="w-100" as={Link} to="/update-profile">
          Update Profile
        </Button>
        <Button
          className="w-100 mt-1"
          variant="secondary"
          as={Link}
          to="/change-password"
        >
          Change Password
        </Button>
      </div>
    </div>
  )
}

export default Profile
