import { LoadAllPostsUseCase } from '../../../domain/usecases/posts/load-all-posts-usecase'
import { ok, serverError } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoadAllPostsController implements Controller {
  constructor (private readonly loadAllPostsUseCase: LoadAllPostsUseCase) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const posts = await this.loadAllPostsUseCase.loadAll()
      return ok(posts)
    } catch (error) {
      return serverError(error)
    }
  }
}
