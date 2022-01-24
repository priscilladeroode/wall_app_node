import { AddPostController } from '@/presentation/controllers/posts/add-post-controller'

import faker from 'faker'
import { HttpRequest } from '@/presentation/protocols'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, created, serverError } from '@/presentation/helpers/http'
import { ValidationSpy } from '../../mocks/mock-validation'
import { AddPostUseCaseSpy } from '../../mocks/mock-post'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: AddPostController
  validationSpy: ValidationSpy
  addPostUseCaseSpy: AddPostUseCaseSpy
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

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addPostUseCaseSpy = new AddPostUseCaseSpy()
  const sut = new AddPostController(validationSpy, addPostUseCaseSpy)
  return {
    sut,
    validationSpy,
    addPostUseCaseSpy
  }
}

describe('AddPostController', () => {
  describe('Validation', () => {
    test('Shoud call Validation with correct values', async () => {
      const { sut, validationSpy } = makeSut()
      const validateSpy = jest.spyOn(validationSpy, 'validate')
      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut()
      validationSpy.error = new MissingParamError('any_field')
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(badRequest(validationSpy.error))
    })
  })

  describe('AddPostUseCase', () => {
    test('Shoud call AddPostUseCase with correct values', async () => {
      const { sut, addPostUseCaseSpy } = makeSut()
      const addSpy = jest.spyOn(addPostUseCaseSpy, 'add')
      await sut.handle(request)
      expect(addSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 500 if AddPostUseCase throws', async () => {
      const { sut, addPostUseCaseSpy } = makeSut()
      jest.spyOn(addPostUseCaseSpy, 'add').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  describe('AddPostUseCase', () => {
    test('Shoud call AddPostUseCase with correct values', async () => {
      const { sut, addPostUseCaseSpy } = makeSut()
      const addSpy = jest.spyOn(addPostUseCaseSpy, 'add')
      await sut.handle(request)
      expect(addSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 500 if AddPostUseCase throws', async () => {
      const { sut, addPostUseCaseSpy } = makeSut()
      jest.spyOn(addPostUseCaseSpy, 'add').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  test('Shoud return 201 if valid post is created', async () => {
    const { sut, addPostUseCaseSpy } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(created(addPostUseCaseSpy.result))
  })
})
