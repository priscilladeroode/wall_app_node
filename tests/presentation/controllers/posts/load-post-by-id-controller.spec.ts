import faker from 'faker'

import { PostEntity } from '@/domain/entities/posts'
import { LoadPostByIdUseCase } from '@/domain/usecases/posts/load-post-by-id-usecase'
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
import { Validation } from '@/presentation/protocols/validation'
import { LoadPostByIdController } from '@/presentation/controllers/posts/load-post-by-id-controller'
import { throwError } from '@/tests/domain/mocks'
import { ValidationSpy } from '../../mocks/mock-validation'

type SutTypes = {
  sut: LoadPostByIdController
  validationSpy: Validation
  loadPostsByIdUseCaseStub: LoadPostByIdUseCase
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdAt = faker.datatype.datetime()
const createdBy = faker.name.findName()

const postEntity: PostEntity = { id, title, content, createdAt, createdBy }

const request: HttpRequest = { body: { id } }

const makeLoadPostsByIdUseCaseStub = (): LoadPostByIdUseCase => {
  class LoadPostsByIdUseCaseStub implements LoadPostByIdUseCase {
    async loadById (id: string): Promise<PostEntity> {
      return await Promise.resolve(postEntity)
    }
  }
  return new LoadPostsByIdUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const loadPostsByIdUseCaseStub = makeLoadPostsByIdUseCaseStub()
  const sut = new LoadPostByIdController(
    loadPostsByIdUseCaseStub,
    validationSpy
  )
  return {
    sut,
    validationSpy,
    loadPostsByIdUseCaseStub
  }
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

  describe('LoadPostByIdUseCase', () => {
    test('Shoud return 500 if LoadPostByIdUseCase throws', async () => {
      const { sut, loadPostsByIdUseCaseStub } = makeSut()
      jest
        .spyOn(loadPostsByIdUseCaseStub, 'loadById')
        .mockImplementationOnce(async () => {
          return await Promise.reject(new Error())
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud call LoadPostByIdUseCase with correct values', async () => {
      const { sut, loadPostsByIdUseCaseStub } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByIdUseCaseStub, 'loadById')
      await sut.handle(request)
      expect(loadByUidSpy).toHaveBeenCalledWith(request.body.id)
    })
  })

  test('Shoud return 200 if LoadPostByIdUseCase return a post', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(postEntity))
  })

  test('Shoud return 404 if LoadPostByIdUseCase return null', async () => {
    const { sut, loadPostsByIdUseCaseStub } = makeSut()
    jest
      .spyOn(loadPostsByIdUseCaseStub, 'loadById')
      .mockImplementationOnce(async () => {
        return await Promise.resolve(null)
      })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
  })
})
