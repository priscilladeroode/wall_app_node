import faker from 'faker'

import {
  MissingParamError,
  NotFoundError,
  ServerError
} from '@/presentation/errors'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '@/presentation/helpers/http'
import { HttpRequest } from '@/presentation/protocols'
import { LoadPostByIdController } from '@/presentation/controllers/posts/load-post-by-id-controller'
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '../../mocks/mock-validation'
import { LoadPostByIdUseCaseSpy } from '../../mocks/mock-post'

type SutTypes = {
  sut: LoadPostByIdController
  validationSpy: ValidationSpy
  loadPostByIdUseCaseSpy: LoadPostByIdUseCaseSpy
}

const request: HttpRequest = { body: { id: faker.datatype.uuid() } }

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadPostByIdUseCaseSpy = new LoadPostByIdUseCaseSpy()
  const sut = new LoadPostByIdController(loadPostByIdUseCaseSpy, validationSpy)
  return { sut, validationSpy, loadPostByIdUseCaseSpy }
}

describe('LoadPostsByIdController', () => {
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

    test('Shoud return 500 if Validation throws', async () => {
      const { sut, validationSpy } = makeSut()
      jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  describe('LoadPostByIdUseCase', () => {
    test('Shoud return 500 if LoadPostByIdUseCase throws', async () => {
      const { sut, loadPostByIdUseCaseSpy } = makeSut()
      jest
        .spyOn(loadPostByIdUseCaseSpy, 'loadById')
        .mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud call LoadPostByIdUseCase with correct values', async () => {
      const { sut, loadPostByIdUseCaseSpy } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostByIdUseCaseSpy, 'loadById')
      await sut.handle(request)
      expect(loadByUidSpy).toHaveBeenCalledWith(request.body.id)
    })
  })

  test('Shoud return 200 if LoadPostByIdUseCase return a post', async () => {
    const { sut, loadPostByIdUseCaseSpy } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(loadPostByIdUseCaseSpy.result))
  })

  test('Shoud return 404 if LoadPostByIdUseCase return null', async () => {
    const { sut, loadPostByIdUseCaseSpy } = makeSut()
    loadPostByIdUseCaseSpy.result = null
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
  })
})
