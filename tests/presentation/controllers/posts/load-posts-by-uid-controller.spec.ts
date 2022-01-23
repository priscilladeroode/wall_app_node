import { LoadPostsResponseEntity, PostEntity } from '@/domain/entities/posts'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

import faker from 'faker'
import { LoadPostsByUidController } from '@/presentation/controllers/posts/load-posts-by-uid-controller'
import { LoadPostsByUidUseCase } from '@/domain/usecases/posts/load-posts-by-uid-usecase'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: LoadPostsByUidController
  validationStub: Validation
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

export const throwError = (): never => {
  throw new Error()
}

const makeLoadPostsByUidUseCaseStub = (): LoadPostsByUidUseCase => {
  class LoadPostsByUidUseCaseStub implements LoadPostsByUidUseCase {
    async loadByUid (): Promise<LoadPostsResponseEntity> {
      return await Promise.resolve(loadPostsResponseEntity)
    }
  }
  return new LoadPostsByUidUseCaseStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadPostsByUidUseCaseStub = makeLoadPostsByUidUseCaseStub()
  const sut = new LoadPostsByUidController(
    loadPostsByUidUseCaseStub,
    validationStub
  )
  return {
    sut,
    validationStub,
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

    test('Shoud return 500 if Validation throws', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })
})
