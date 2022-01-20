export default {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb://localhost:27017/wall-app-backend',
  port: process.env.PORT || 5050
}
