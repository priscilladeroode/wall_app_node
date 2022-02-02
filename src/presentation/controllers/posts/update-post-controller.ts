import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError
} from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'
import { UpdatePostUseCase } from '@/domain/usecases/posts/update-post-usecase'
import { ResultEnum } from '@/domain/enums/result-enums'
import { NotFoundError, UnauthorizedError } from '../../errors'

export class UpdatePostController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly updatePostUseCase: UpdatePostUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const post = await this.updatePostUseCase.update(httpRequest.body)
      switch (post) {
        case ResultEnum.forbidden: {
          return forbidden(new UnauthorizedError())
        }
        case ResultEnum.notFound: {
          return notFound(new NotFoundError(httpRequest.body.id))
        }
        default: {
          return ok(post)
        }
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
