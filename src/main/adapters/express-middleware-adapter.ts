import { Middleware } from '../../presentation/protocols/middlewares'
import { Request, Response, NextFunction } from 'express'
import { HttpRequest } from '../../presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, { uid: req.uid })
      next()
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message })
    }
  }
}
