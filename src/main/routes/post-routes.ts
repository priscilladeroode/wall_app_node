import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddPostController } from '../factories/controllers/posts/add-post-controller-factory'
import { makeDeletePostByIdController } from '../factories/controllers/posts/delete-post-by-id-controller-factory'
import { makeLoadAllPostsController } from '../factories/controllers/posts/load-all-posts-controller-factory'
import { makeAuth } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  router.get('/posts', adaptRoute(makeLoadAllPostsController()))
  router.get('/posts/:id', adaptRoute(makeLoadAllPostsController()))
  router.get('/postsByUser/:userId', adaptRoute(makeLoadAllPostsController()))
  router.post(
    '/posts',
    adaptMiddleware(makeAuth()),
    adaptRoute(makeAddPostController())
  )
  router.put(
    '/posts/:id',
    adaptMiddleware(makeAuth()),
    adaptRoute(makeLoadAllPostsController())
  )
  router.delete(
    '/deleteById/:id',
    adaptMiddleware(makeAuth()),
    adaptRoute(makeDeletePostByIdController())
  )
}
