import { Validation } from '@/presentation/protocols/validation'
import { AddPostController } from '@/presentation/controllers/posts/add-post-controller'

import faker from 'faker'
import { HttpRequest } from '@/presentation/protocols'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, created, serverError } from '@/presentation/helpers/http'
import { AddPostUseCase } from '@/domain/usecases/posts/add-post-usecase'
import {
  AddPostRequestEntity,
  AddPostResponseEntity
} from '@/domain/entities/posts'

type SutTypes = {
  sut: AddPostController
  validationStub: Validation
  addPostUseCaseStub: AddPostUseCase
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()

const request: HttpRequest = {
  body: {
    title,
    content,
    uid
  }
}

const id = faker.datatype.uuid()

const addPostRequest: AddPostRequestEntity = { title, content, uid }

const response: AddPostResponseEntity = { id }

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddPostUseCase = (): AddPostUseCase => {
  class AddPostUseCaseStub implements AddPostUseCase {
    async add (
      authRequestEntity: AddPostRequestEntity
    ): Promise<AddPostResponseEntity> {
      return await Promise.resolve(response)
    }
  }
  return new AddPostUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addPostUseCaseStub = makeAddPostUseCase()
  const sut = new AddPostController(validationStub, addPostUseCaseStub)
  return {
    sut,
    validationStub,
    addPostUseCaseStub
  }
}

describe('AddPostController', () => {
  describe('Validation', () => {
    test('Shoud call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest
        .spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'))
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field'))
      )
    })
  })

  describe('AddPostUseCase', () => {
    test('Shoud call AddPostUseCase with correct values', async () => {
      const { sut, addPostUseCaseStub } = makeSut()
      const addSpy = jest.spyOn(addPostUseCaseStub, 'add')
      await sut.handle(request)
      expect(addSpy).toHaveBeenCalledWith(addPostRequest)
    })

    test('Shoud return 500 if AddPostUseCase throws', async () => {
      const { sut, addPostUseCaseStub } = makeSut()
      jest.spyOn(addPostUseCaseStub, 'add').mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  describe('AddPostUseCase', () => {
    test('Shoud call AddPostUseCase with correct values', async () => {
      const { sut, addPostUseCaseStub } = makeSut()
      const addSpy = jest.spyOn(addPostUseCaseStub, 'add')
      await sut.handle(request)
      expect(addSpy).toHaveBeenCalledWith(addPostRequest)
    })

    test('Shoud return 500 if AddPostUseCase throws', async () => {
      const { sut, addPostUseCaseStub } = makeSut()
      jest.spyOn(addPostUseCaseStub, 'add').mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  test('Shoud return 201 if valid post is created', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(created(response))
  })
})
