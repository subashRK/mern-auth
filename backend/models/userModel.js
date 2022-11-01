import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  profilePhotoURL: String,
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  bio: { type: String, default: "I too have an account in this community!" },
  dateCreated: { type: Date, default: Date.now },
})

export default mongoose.model("User", userSchema)
