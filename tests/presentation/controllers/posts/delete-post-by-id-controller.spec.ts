import faker from 'faker'

import { DeletePostByIdController } from '@/presentation/controllers/posts/delete-post-by-id-controller'
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
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '../../mocks/mock-validation'
import { DeletePostByIdUseCaseSpy } from '../../mocks/mock-post'

type SutTypes = {
  sut: DeletePostByIdController
  validationSpy: ValidationSpy
  deletePostByIdUseCaseSpy: DeletePostByIdUseCaseSpy
}

const request = {
  body: { id: faker.datatype.uuid(), uid: faker.datatype.uuid() }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const deletePostByIdUseCaseSpy = new DeletePostByIdUseCaseSpy()
  const sut = new DeletePostByIdController(
    validationSpy,
    deletePostByIdUseCaseSpy
  )
  return {
    sut,
    validationSpy,
    deletePostByIdUseCaseSpy
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
      validationSpy.error = new MissingParamError('any')
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

  describe('DeletePostUseCase', () => {
    test('Shoud call DeletePostUseCase with correct values', async () => {
      const { sut, deletePostByIdUseCaseSpy } = makeSut()
      const updateSpy = jest.spyOn(deletePostByIdUseCaseSpy, 'delete')
      await sut.handle(request)
      expect(updateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 500 if DeletePostUseCase throws', async () => {
      const { sut, deletePostByIdUseCaseSpy } = makeSut()
      jest
        .spyOn(deletePostByIdUseCaseSpy, 'delete')
        .mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  test('Shoud return 200 if post is deleted', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok({ message: 'Post deleted successfully' }))
  })

  test('Shoud return 404 if post cant be not found', async () => {
    const { sut, deletePostByIdUseCaseSpy } = makeSut()
    deletePostByIdUseCaseSpy.result = ResultEnum.notFound
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
  })

  test('Shoud return 403 if post dont belong to the user', async () => {
    const { sut, deletePostByIdUseCaseSpy } = makeSut()
    deletePostByIdUseCaseSpy.result = ResultEnum.forbidden
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })
})
