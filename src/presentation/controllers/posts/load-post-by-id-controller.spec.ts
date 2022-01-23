import faker from 'faker'

import { PostEntity } from '../../../domain/entities/posts'
import { LoadPostsByIdUseCase } from '../../../domain/usecases/posts/load-post-by-id-usecase'
import { MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http'
import { HttpRequest } from '../../protocols'
import { Validation } from '../../protocols/validation'
import { LoadPostsByIdController } from './load-post-by-id-controller'

type SutTypes = {
  sut: LoadPostsByIdController
  validationStub: Validation
  loadPostsByIdUseCaseStub: LoadPostsByIdUseCase
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdAt = faker.datatype.datetime()
const createdBy = faker.name.findName()

const postEntity: PostEntity = { id, title, content, createdAt, createdBy }

const request: HttpRequest = { body: { id } }

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeLoadPostsByIdUseCaseStub = (): LoadPostsByIdUseCase => {
  class LoadPostsByIdUseCaseStub implements LoadPostsByIdUseCase {
    async loadById (id: string): Promise<PostEntity> {
      return await Promise.resolve(postEntity)
    }
  }
  return new LoadPostsByIdUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadPostsByIdUseCaseStub = makeLoadPostsByIdUseCaseStub()
  const sut = new LoadPostsByIdController(
    loadPostsByIdUseCaseStub,
    validationStub
  )
  return {
    sut,
    validationStub,
    loadPostsByIdUseCaseStub
  }
}

export const throwError = (): never => {
  throw new Error()
}

describe('LoadPostsByIdController', () => {
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

  describe('LoadPostsByIdUseCase', () => {
    test('Shoud return 500 if LoadPostsByIdUseCase throws', async () => {
      const { sut, loadPostsByIdUseCaseStub } = makeSut()
      jest
        .spyOn(loadPostsByIdUseCaseStub, 'loadById')
        .mockImplementationOnce(async () => {
          return await Promise.reject(new Error())
        })
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })
})
