import { LoadAllPostsController } from '../../../../presentation/controllers/posts/load-all-posts-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeLoadAllPostUseCase } from '../../usecases/posts/load-all-posts-usecase-factory'

export const makeLoadAllPostsController = (): Controller => {
  const usecase = makeLoadAllPostUseCase()
  const controller = new LoadAllPostsController(usecase)
  return makeLogControllerDecorator(controller)
}
