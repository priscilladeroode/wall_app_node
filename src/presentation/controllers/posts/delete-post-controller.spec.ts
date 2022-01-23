import { DeletePostResponseEntity } from '../../../domain/entities/posts/delete-post-response-entity'
import { DeletePostUseCase } from '../../../domain/usecases/posts/delete-post-usecase'
import { Validation } from '../../protocols/validation'
import { DeletePostController } from './delete-post-controller'
import faker from 'faker'
type SutTypes = {
  sut: DeletePostController
  validationStub: Validation
  deletePostUseCaseStub: DeletePostUseCase
}

const id = faker.datatype.uuid()
const uid = faker.datatype.uuid()

const request = { body: { id, uid } }

const deletePostResponseEntity: DeletePostResponseEntity = {
  message: 'Post deleted succesfully'
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeDeletePostUseCase = (): DeletePostUseCase => {
  class DeletePostUseCaseStub implements DeletePostUseCase {
    async delete (postId: string): Promise<DeletePostResponseEntity> {
      return await Promise.resolve(deletePostResponseEntity)
    }
  }
  return new DeletePostUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const deletePostUseCaseStub = makeDeletePostUseCase()
  const sut = new DeletePostController(validationStub, deletePostUseCaseStub)
  return {
    sut,
    validationStub,
    deletePostUseCaseStub
  }
}

describe('UpdatePostController', () => {
  describe('Validation', () => {
    test('Shoud call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request.body)
    })
  })
})
