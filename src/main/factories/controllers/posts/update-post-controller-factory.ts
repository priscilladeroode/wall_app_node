import { UpdatePostController } from '../../../../presentation/controllers/posts/update-post-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeUpdatePostUseCase } from '../../usecases/posts/update-post-usecase-factory'
import { makeUpdatePostValidation } from '../../validations/posts/update-post-validation-factory'

export const makeUpdatePostController = (): Controller => {
  const usecase = makeUpdatePostUseCase()
  const validation = makeUpdatePostValidation()
  const controller = new UpdatePostController(validation, usecase)
  return makeLogControllerDecorator(controller)
}
