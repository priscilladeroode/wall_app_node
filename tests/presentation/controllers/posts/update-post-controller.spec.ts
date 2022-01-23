import { Validation } from '@/presentation/protocols/validation'
import { HttpRequest } from '@/presentation/protocols'
import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '@/domain/entities/posts'
import { UpdatePostController } from '@/presentation/controllers/posts/update-post-controller'

import faker from 'faker'
import { UpdatePostUseCase } from '@/domain/usecases/posts/update-post-usecase'
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

type SutTypes = {
  sut: UpdatePostController
  validationSpy: Validation
  updatePostUseCaseStub: UpdatePostUseCase
}

const id = faker.datatype.uuid()
const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()
const missingParam = faker.datatype.string()

const request: HttpRequest = {
  body: {
    id,
    title,
    content,
    uid
  }
}

const updatePostRequestEntity: UpdatePostRequestEntity = {
  id,
  title,
  content,
  uid
}

const updatePostResponseEntity: UpdatePostResponseEntity = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const makeUpdatePostUseCase = (): UpdatePostUseCase => {
  class UpdatePostUseCaseStub implements UpdatePostUseCase {
    async update (
      post: UpdatePostRequestEntity
    ): Promise<UpdatePostResponseEntity> {
      return await Promise.resolve(updatePostResponseEntity)
    }
  }
  return new UpdatePostUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const updatePostUseCaseStub = makeUpdatePostUseCase()
  const sut = new UpdatePostController(validationSpy, updatePostUseCaseStub)
  return {
    sut,
    validationSpy,
    updatePostUseCaseStub
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
      jest
        .spyOn(validationSpy, 'validate')
        .mockReturnValueOnce(new MissingParamError(missingParam))
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError(missingParam))
      )
    })
  })

  describe('UpdatePostUseCase', () => {
    test('Shoud call UpdatePostUseCase with correct values', async () => {
      const { sut, updatePostUseCaseStub } = makeSut()
      const updateSpy = jest.spyOn(updatePostUseCaseStub, 'update')
      await sut.handle(request)
      expect(updateSpy).toHaveBeenCalledWith(updatePostRequestEntity)
    })

    test('Shoud return 500 if UpdatePostUseCase throws', async () => {
      const { sut, updatePostUseCaseStub } = makeSut()
      jest
        .spyOn(updatePostUseCaseStub, 'update')
        .mockImplementationOnce(async () => {
          return await Promise.reject(new Error())
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Shoud return 200 if post is update', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(ok(updatePostResponseEntity))
    })

    test('Shoud return 403 if post owner is not the same', async () => {
      const { sut, updatePostUseCaseStub } = makeSut()
      jest
        .spyOn(updatePostUseCaseStub, 'update')
        .mockImplementationOnce(async () => {
          return await Promise.resolve(ResultEnum.forbidden)
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
    })

    test('Shoud return 404 if post owner is not the same', async () => {
      const { sut, updatePostUseCaseStub } = makeSut()
      jest
        .spyOn(updatePostUseCaseStub, 'update')
        .mockImplementationOnce(async () => {
          return await Promise.resolve(ResultEnum.notFound)
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
    })
  })
})
