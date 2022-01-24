import faker from 'faker'
import { HttpRequest } from '@/presentation/protocols'
import { UpdatePostController } from '@/presentation/controllers/posts/update-post-controller'
import {
  MissingParamError,
  NotFoundError,
  ServerError,
  UnauthorizedError
} from '@/presentation/errors'
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError
} from '@/presentation/helpers/http'
import { ResultEnum } from '@/domain/enums/result-enums'
import { ValidationSpy } from '../../mocks/mock-validation'
import { UpdatePostUseCaseSpy } from '../../mocks/mock-post'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: UpdatePostController
  validationSpy: ValidationSpy
  updatePostUseCaseSpy: UpdatePostUseCaseSpy
}

const missingParam = faker.datatype.string()

const request: HttpRequest = {
  body: {
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    uid: faker.datatype.uuid()
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const updatePostUseCaseSpy = new UpdatePostUseCaseSpy()
  const sut = new UpdatePostController(validationSpy, updatePostUseCaseSpy)
  return {
    sut,
    validationSpy,
    updatePostUseCaseSpy
  }
}

describe('UpdatePostController', () => {
  describe('Validation', () => {
    test('Shoud call Validation with correct values', async () => {
      const { sut, validationSpy } = makeSut()
      const validateSpy = jest.spyOn(validationSpy, 'validate')
      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut()
      validationSpy.error = new MissingParamError(missingParam)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(badRequest(validationSpy.error))
    })
  })

  describe('UpdatePostUseCase', () => {
    test('Shoud call UpdatePostUseCase with correct values', async () => {
      const { sut, updatePostUseCaseSpy } = makeSut()
      const updateSpy = jest.spyOn(updatePostUseCaseSpy, 'update')
      await sut.handle(request)
      expect(updateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 500 if UpdatePostUseCase throws', async () => {
      const { sut, updatePostUseCaseSpy } = makeSut()
      jest
        .spyOn(updatePostUseCaseSpy, 'update')
        .mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud return 200 if post is update', async () => {
      const { sut, updatePostUseCaseSpy } = makeSut()
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(ok(updatePostUseCaseSpy.result))
    })

    test('Shoud return 403 if post owner is not the same', async () => {
      const { sut, updatePostUseCaseSpy } = makeSut()
      jest
        .spyOn(updatePostUseCaseSpy, 'update')
        .mockImplementationOnce(async () => {
          return await Promise.resolve(ResultEnum.forbidden)
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
    })

    test('Shoud return 404 if post owner is not the same', async () => {
      const { sut, updatePostUseCaseSpy } = makeSut()
      jest
        .spyOn(updatePostUseCaseSpy, 'update')
        .mockImplementationOnce(async () => {
          return await Promise.resolve(ResultEnum.notFound)
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
    })
  })
})
