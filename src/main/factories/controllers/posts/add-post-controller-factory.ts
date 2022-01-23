import { AddPostController } from '@/presentation/controllers/posts/add-post-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAddPostUseCase } from '../../usecases/posts/add-post-usecase-factory'
import { makeAddPostValidation } from '../../validations/posts/add-post-validation-factory'

export const makeAddPostController = (): Controller => {
  const usecase = makeAddPostUseCase()
  const validation = makeAddPostValidation()
  const controller = new AddPostController(validation, usecase)
  return makeLogControllerDecorator(controller)
}
