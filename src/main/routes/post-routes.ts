import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddPostController } from '../factories/controllers/posts/add-post-controller-factory'
import { makeAuth } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  router.post(
    '/posts',
    adaptMiddleware(makeAuth()),
    adaptRoute(makeAddPostController())
  )
}
