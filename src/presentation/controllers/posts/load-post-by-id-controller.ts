import { LoadPostByIdUseCase } from '../../../domain/usecases/posts/load-post-by-id-usecase'
import { NotFoundError } from '../../errors'
import { badRequest, notFound, ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class LoadPostByIdController implements Controller {
  constructor (
    private readonly loadPostByIdUseCase: LoadPostByIdUseCase,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { id } = httpRequest.body
      const posts = await this.loadPostByIdUseCase.loadById(id)
      if (!posts) {
        return notFound(new NotFoundError(id))
      }
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }
}
