import { Validation } from '../../protocols/validation'
import { HttpRequest } from '../../protocols'
import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '../../../domain/entities/posts'
import { UpdatePostController } from './update-post-controller'

import faker from 'faker'
import { UpdatePostUseCase } from '../../../domain/usecases/posts/update-post-usecase'

type SutTypes = {
  sut: UpdatePostController
  validationStub: Validation
  updatePostUseCaseStub: UpdatePostUseCase
}

const id = faker.datatype.uuid()
const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()

const request: HttpRequest = {
  body: {
    id,
    title,
    content,
    uid
  }
}

const updatePostResponseEntityEntity: UpdatePostResponseEntity = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeUpdatePostUseCase = (): UpdatePostUseCase => {
  class UpdatePostUseCaseStub implements UpdatePostUseCase {
    async update (
      post: UpdatePostRequestEntity
    ): Promise<UpdatePostResponseEntity> {
      return await Promise.resolve(updatePostResponseEntityEntity)
    }
  }
  return new UpdatePostUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const updatePostUseCaseStub = makeUpdatePostUseCase()
  const sut = new UpdatePostController(validationStub, updatePostUseCaseStub)
  return {
    sut,
    validationStub,
    updatePostUseCaseStub
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
