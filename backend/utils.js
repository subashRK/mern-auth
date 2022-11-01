import nodemailer from "nodemailer"
import bcrypt from "bcrypt"

export async function importEnv() {
  if (process.env.DEV != null) {
    const dotenv = await import("dotenv")
    dotenv.config()
  }
}

export async function sendMail(to, subject, text) {
  await importEnv()

  const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({ from: EMAIL_ADDRESS, to, subject, text })
}

export function generatePassword() {
  const length = 16
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-!"
  let password = ""

  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }

  return password
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt()
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password1, password2) {
  return bcrypt.compare(password1, password2)
}
