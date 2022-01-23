import { LoadPostsByUidController } from '../../../../presentation/controllers/posts/load-posts-by-uid-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeLoadPostsByUidUseCase } from '../../usecases/posts/load-posts-by-uid-usecase-factory'
import { makeLoadPostsByUidValidation } from '../../validations/posts/load-posts-by-uid-validation-factory'

export const makeLoadPostsByUidController = (): Controller => {
  const usecase = makeLoadPostsByUidUseCase()
  const validation = makeLoadPostsByUidValidation()
  const controller = new LoadPostsByUidController(usecase, validation)
  return makeLogControllerDecorator(controller)
}
