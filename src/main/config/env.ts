import 'dotenv/config'

export default {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  sendGrid: process.env.SENDGRID_API_KEY
}
