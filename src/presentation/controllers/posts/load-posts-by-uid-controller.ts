import { LoadPostsByUidUseCase } from '../../../domain/usecases/posts/load-posts-by-uid-usecase'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class LoadPostsByUidController implements Controller {
  constructor (
    private readonly loadPostsByUidUseCase: LoadPostsByUidUseCase,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { userId } = httpRequest.body
      const posts = await this.loadPostsByUidUseCase.loadByUid({ uid: userId })
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }
}
