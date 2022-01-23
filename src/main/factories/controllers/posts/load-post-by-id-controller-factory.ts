import { LoadPostByIdController } from '../../../../presentation/controllers/posts/load-post-by-id-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeLoadPostByIdUseCase } from '../../usecases/posts/load-post-by-id-usecase-factory'
import { makeLoadPostByIdValidation } from '../../validations/posts/load-post-by-id-factory'

export const makeLoadPostByIdController = (): Controller => {
  const usecase = makeLoadPostByIdUseCase()
  const validation = makeLoadPostByIdValidation()
  const controller = new LoadPostByIdController(usecase, validation)
  return makeLogControllerDecorator(controller)
}
