import { DeletePostUseCase } from '../../../domain/usecases/posts/delete-post-usecase'
import { badRequest, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class DeletePostController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly deletePostUseCase: DeletePostUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
