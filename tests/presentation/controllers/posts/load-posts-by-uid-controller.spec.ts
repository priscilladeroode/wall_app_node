import { LoadPostsResponseEntity, PostEntity } from '@/domain/entities/posts'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

import faker from 'faker'
import { LoadPostsByUidController } from '@/presentation/controllers/posts/load-posts-by-uid-controller'
import { LoadPostsByUidUseCase } from '@/domain/usecases/posts/load-posts-by-uid-usecase'
import { Validation } from '@/presentation/protocols/validation'
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '../../mocks/mock-validation'

type SutTypes = {
  sut: LoadPostsByUidController
  validationSpy: Validation
  loadPostsByUidUseCaseStub: LoadPostsByUidUseCase
}
const userId = faker.datatype.uuid()
const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdAt = faker.datatype.datetime()
const createdBy = faker.name.findName()

const request = { body: { userId } }

const postEntity: PostEntity = { id, title, content, createdAt, createdBy }

const loadPostsResponseEntity: LoadPostsResponseEntity = [
  postEntity,
  postEntity
]

const makeLoadPostsByUidUseCaseStub = (): LoadPostsByUidUseCase => {
  class LoadPostsByUidUseCaseStub implements LoadPostsByUidUseCase {
    async loadByUid (): Promise<LoadPostsResponseEntity> {
      return await Promise.resolve(loadPostsResponseEntity)
    }
  }
  return new LoadPostsByUidUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadPostsByUidUseCaseStub = makeLoadPostsByUidUseCaseStub()
  const sut = new LoadPostsByUidController(
    loadPostsByUidUseCaseStub,
    validationSpy
  )
  return {
    sut,
    validationSpy,
    loadPostsByUidUseCaseStub
  }
}

describe('LoadPostsByUidController', () => {
  describe('LoadPostsByUidUseCase', () => {
    test('Shoud return 500 if LoadPostsByUidUseCase throws', async () => {
      const { sut, loadPostsByUidUseCaseStub } = makeSut()
      jest
        .spyOn(loadPostsByUidUseCaseStub, 'loadByUid')
        .mockImplementationOnce(async () => {
          return await Promise.reject(new Error())
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud return 200 if LoadPostsByUidUseCase returns posts', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(ok(loadPostsResponseEntity))
    })

    test('Shoud call LoadPostsByUidUseCase with correct values', async () => {
      const { sut, loadPostsByUidUseCaseStub } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByUidUseCaseStub, 'loadByUid')
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
      jest
        .spyOn(validationSpy, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'))
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
