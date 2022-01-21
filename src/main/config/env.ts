export default {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb://localhost:27017/wall-app-backend',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'PRtA1988*2305=pEFG'
}
