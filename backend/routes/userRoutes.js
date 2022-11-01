import { Router } from "express"
import jwt from "jsonwebtoken"
import validator from "validator"
import User from "../models/userModel.js"
import {
  comparePassword,
  generatePassword,
  hashPassword,
  importEnv,
  sendMail,
} from "../utils.js"
import { authRequired } from "../middlewares.js"

await importEnv()

const router = Router()

// Environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_EMAIL_VERIFICATION_SECRET_KEY =
  process.env.JWT_EMAIL_VERIFICATION_SECRET_KEY
const SERVER_URL = process.env.SERVER_URL
const CLIENT_URL = process.env.CLIENT_URL

router.get("/user", async (req, res) => {
  const userToken = req.cookies["user-token"]

  if (userToken == null || userToken.trim() === "") return res.json(null)

  try {
    const payload = jwt.verify(userToken, JWT_SECRET_KEY)

    const user = await User.findOne({ _id: payload?.id })
    delete user.password

    res.json(user)
  } catch (e) {
    console.log(e.message)
    res.status(500).send("Something went wrong!")
  }
})

router.post("/create-account", async (req, res) => {
  const email = req.body?.email
  let username = req.body?.username
  const profilePhotoURL = req.body?.profilePhotoURL
  const password = req.body?.password

  if (email == null || !validator.isEmail(email))
    return res.status(400).send("Please enter a correct email address!")

  try {
    if ((await User.findOne({ email })) != null)
      return res
        .status(400)
        .send(
          "This email is already taken by someone! If this is your email then try loggin in with this email as it is easy to takeover your account with email verification. So please try logging in with this email using email verification method!"
        )
    if (username.trim() === "") username = null
    if (password == null || !validator.isStrongPassword(password))
      return res.status(400).send("Please enter a strong password!")

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      email,
      username,
      profilePhotoURL,
      password: hashedPassword,
    })

    const emailVerificationToken = jwt.sign(
      { id: user._id },
      JWT_EMAIL_VERIFICATION_SECRET_KEY,
      { expiresIn: "1h" }
    )

    const text = `This is a verification process. We've already created your account. But you can't login unless you verify your email address. So please click this link (To verify your account with this(${email}) email address) : ${SERVER_URL}/auth/verify-email?token=${emailVerificationToken}. This link will expire in an hour. Don't' share this link to anyone.`

    await sendMail(email, "Email Verification", text)

    res.status(200).send("Succesfully created an account!")
  } catch {
    res.status(500).send("Something went wrong!")
  }
})

router.get("/verify-email", async (req, res) => {
  const token = req.query?.token

  if (!token) return res.status(400).send("Please send a token!")

  try {
    const payload = jwt.verify(token, JWT_EMAIL_VERIFICATION_SECRET_KEY)

    const id = payload?.id

    if (id == null) return res.status(400).send("Invalid token!")
    const user = await User.findOne({ _id: id })
    if (user == null) return res.status(400).send("Invalid user!")
    if (!user.emailVerified) {
      await User.updateOne({ _id: id }, { emailVerified: true })
    }

    const userToken = jwt.sign({ id: user._id }, JWT_SECRET_KEY)

    res.cookie("user-token", userToken, { httpOnly: true, secure: true })
    res.status(200).redirect(CLIENT_URL)
  } catch (e) {
    console.log(e.message)
    res.status(500).send("Something went wrong!")
  }
})

router.get("/send-email", async (req, res) => {
  const email = req.query?.email

  if (email == null)
    return res.status(400).send("Please enter an email address!")

  try {
    const user = await User.findOne({ email })

    if (user == null)
      return res.status(400).send("No account exists with this email address!")

    const emailVerificationToken = jwt.sign(
      { id: user._id },
      JWT_EMAIL_VERIFICATION_SECRET_KEY,
      { expiresIn: "1h" }
    )

    const text = `This is a verification process. Use this link to login. So please click this link (To verify your account with this(${email}) email address) : ${SERVER_URL}/auth/verify-email?token=${emailVerificationToken}. This link will expire in an hour. Don't' share this link to anyone.`

    await sendMail(email, "Email Verification", text)

    res
      .status(200)
      .send(
        `We have sent an email to ${email}. Please use the link in the email address to login!`
      )
  } catch {
    res.status(500).send("Somethign went wrong!")
  }
})

router.post("/login", async (req, res) => {
  const email = req.body?.email
  const password = req.body?.password

  if (email == null || password == null)
    return res.status(400).send("Please Enter all the data!")

  try {
    const user = await User.findOne({ email })

    if (user == null)
      return res.status(400).send("No user exists with this email!")

    const isCorrectPassword = await comparePassword(password, user.password)

    if (!isCorrectPassword)
      return res.status(400).send("Please enter correct password!")

    delete user.password

    const userToken = jwt.sign({ id: user._id }, JWT_SECRET_KEY)

    res.cookie("user-token", userToken, { httpOnly: true, secure: true })
    res.json({ user })
  } catch {
    res.status(500).send("Something went wrong!")
  }
})

router.get("/reset-password", authRequired, async (req, res) => {
  const newPassword = generatePassword()
  const text = `Your new password is ${newPassword}`

  try {
    const hashedPassword = await hashPassword(newPassword)
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: hashedPassword }
    )
    await sendMail(req.user.email, "Reset Password", text)
    res.status(200).send("Sent an email with new password")
  } catch (e) {
    res.status(500).send("Something went wrong!")
  }
})

router.post("/change-password", authRequired, async (req, res) => {
  const oldPassword = req.body?.oldPassword
  const newPassword = req.body?.newPassword

  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .send("Please Enter your old password and new password!")
  if (!validator.isStrongPassword(newPassword))
    return res.status(400).send("Please enter a strong new password!")

  try {
    const isCorrectPassword = await comparePassword(
      oldPassword,
      req.user.password
    )

    if (!isCorrectPassword)
      return res.status(401).send("Please enter your correct old password!")
    if (oldPassword === newPassword)
      return res.status(400).send("Please enter a different new password!")

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: newPassword }
    )

    res.status(204).send("The password has been changed successfully!")
  } catch {
    res.status(500).send("Something went wrong!")
  }
})

router.post("/update-profile", authRequired, async (req, res) => {
  const username = req.body?.username || null
  const profilePhotoURL = req.body?.profilePhotoURL || null
  const bio = req.body?.bio || null

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { username, profilePhotoURL, bio },
      { new: true }
    )

    delete user.password

    res.json({ msg: "Successfully updated!", user })
  } catch {
    res.status(500).send("Something went wrong!")
  }
})

export default router
