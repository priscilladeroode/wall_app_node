import 'dotenv/config'

export default {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb://localhost:27017/wall-app-backend',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'PRtA1988*2305=pEFG',
  sendGrid:
    process.env.SENDGRID_API_KEY ||
    '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'
}
