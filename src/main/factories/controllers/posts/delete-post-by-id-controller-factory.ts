import { DeletePostByIdController } from '../../../../presentation/controllers/posts/delete-post-by-id-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDeletePostByIdUseCase } from '../../usecases/posts/delete-post-by-id-usecase-factory'
import { makeDeletePostByIdValidation } from '../../validations/posts/delete-post-by-id-validation-factory'

export const makeDeletePostByIdController = (): Controller => {
  const usecase = makeDeletePostByIdUseCase()
  const validation = makeDeletePostByIdValidation()
  const controller = new DeletePostByIdController(validation, usecase)
  return makeLogControllerDecorator(controller)
}
