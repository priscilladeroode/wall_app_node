import { ResultEnum } from '../../../domain/enums/result-enums'
import { DeletePostByIdUseCase } from '../../../domain/usecases/posts/delete-post-by-id-usecase'
import { NotFoundError, UnauthorizedError } from '../../errors'
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError
} from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class DeletePostByIdController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly deletePostByIdUseCase: DeletePostByIdUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { uid, id } = httpRequest.body
      const post = await this.deletePostByIdUseCase.delete({ id, uid })
      switch (post) {
        case ResultEnum.notFound: {
          return notFound(new NotFoundError(id))
        }
        case ResultEnum.forbidden: {
          return forbidden(new UnauthorizedError())
        }
        default: {
          return ok({ message: 'Post deleted successfully' })
        }
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
