import jwt from "jsonwebtoken"
import { importEnv } from "./utils.js"
import User from "./models/userModel.js"

await importEnv()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export async function authRequired(req, res, next) {
  const userToken = req.cookies?.["user-token"]

  if (userToken == null) return res.status(401).send("Unauthorized!")

  try {
    const payload = jwt.verify(userToken, JWT_SECRET_KEY)

    const user = await User.findOne({ _id: payload?.id })

    if (user == null) return res.status(401).send("Unauthorized")

    req.user = user
    next()
  } catch (e) {
    console.log(e.message)
    res.status(500).send("Something went wrong!")
  }
}
