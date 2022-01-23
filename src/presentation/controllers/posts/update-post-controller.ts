import { badRequest, ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'
import { UpdatePostUseCase } from '../../../domain/usecases/posts/update-post-usecase'

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
      return ok(post)
    } catch (error) {
      return serverError(error)
    }
  }
}
