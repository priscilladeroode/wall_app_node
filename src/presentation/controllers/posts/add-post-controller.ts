import { AddPostUseCase } from '../../../domain/usecases/posts/add-post-usecase'
import { badRequest, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class AddPostController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addPostUseCase: AddPostUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      await this.addPostUseCase.add(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
