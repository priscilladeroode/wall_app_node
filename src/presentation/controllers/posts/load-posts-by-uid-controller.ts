import { LoadPostsByUidUseCase } from '../../../domain/usecases/posts/load-posts-by-uid-usecase'
import { ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoadPostsByUidController implements Controller {
  constructor (private readonly loadPostsByUidUseCase: LoadPostsByUidUseCase) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      const posts = await this.loadPostsByUidUseCase.loadByUid({ uid: userId })
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }
}
