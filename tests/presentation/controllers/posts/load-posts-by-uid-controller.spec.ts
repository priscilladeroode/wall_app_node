import faker from 'faker'

import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'
import { LoadPostsByUidController } from '@/presentation/controllers/posts/load-posts-by-uid-controller'
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '../../mocks/mock-validation'
import { LoadPostsByUidUseCaseSpy } from '../../mocks/mock-post'

type SutTypes = {
  sut: LoadPostsByUidController
  validationSpy: ValidationSpy
  loadPostsByUidUseCaseSpy: LoadPostsByUidUseCaseSpy
}
const userId = faker.datatype.uuid()

const request = { body: { userId } }

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadPostsByUidUseCaseSpy = new LoadPostsByUidUseCaseSpy()
  const sut = new LoadPostsByUidController(
    loadPostsByUidUseCaseSpy,
    validationSpy
  )
  return {
    sut,
    validationSpy,
    loadPostsByUidUseCaseSpy
  }
}

describe('LoadPostsByUidController', () => {
  describe('LoadPostsByUidUseCase', () => {
    test('Shoud return 500 if LoadPostsByUidUseCase throws', async () => {
      const { sut, loadPostsByUidUseCaseSpy } = makeSut()
      jest
        .spyOn(loadPostsByUidUseCaseSpy, 'loadByUid')
        .mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud return 200 if LoadPostsByUidUseCase returns posts', async () => {
      const { sut, loadPostsByUidUseCaseSpy } = makeSut()
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(ok(loadPostsByUidUseCaseSpy.result))
    })

    test('Shoud call LoadPostsByUidUseCase with correct values', async () => {
      const { sut, loadPostsByUidUseCaseSpy } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByUidUseCaseSpy, 'loadByUid')
      await sut.handle(request)
      expect(loadByUidSpy).toHaveBeenCalledWith({ uid: userId })
    })
  })

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
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field'))
      )
    })

    test('Shoud return 500 if Validation throws', async () => {
      const { sut, validationSpy } = makeSut()
      jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })
})
