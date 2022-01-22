import { badRequest, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class AddPostController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
