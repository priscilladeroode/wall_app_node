import { DeletePostResponseEntity } from '@/domain/entities/posts/delete-post-response-entity'
import { DeletePostByIdUseCase } from '@/domain/usecases/posts/delete-post-by-id-usecase'
import { Validation } from '@/presentation/protocols/validation'
import { DeletePostByIdController } from '@/presentation/controllers/posts/delete-post-by-id-controller'
import faker from 'faker'
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
import { DeletePostRequestEntity } from '@/domain/entities/posts'
import { ResultEnum } from '@/domain/enums/result-enums'

type SutTypes = {
  sut: DeletePostByIdController
  validationStub: Validation
  deletePostUseCaseStub: DeletePostByIdUseCase
}

const id = faker.datatype.uuid()
const uid = faker.datatype.uuid()
const missingParam = faker.datatype.string()

const request = { body: { id, uid } }

const deletePostRequestEntity: DeletePostRequestEntity = { id, uid }

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeDeletePostUseCase = (): DeletePostByIdUseCase => {
  class DeletePostUseCaseStub implements DeletePostByIdUseCase {
    async delete (
      entity: DeletePostRequestEntity
    ): Promise<DeletePostResponseEntity> {
      return await Promise.resolve(ResultEnum.success)
    }
  }
  return new DeletePostUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const deletePostUseCaseStub = makeDeletePostUseCase()
  const sut = new DeletePostByIdController(
    validationStub,
    deletePostUseCaseStub
  )
  return {
    sut,
    validationStub,
    deletePostUseCaseStub
  }
}

export const throwError = (): never => {
  throw new Error()
}

describe('UpdatePostController', () => {
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
        .mockReturnValueOnce(new MissingParamError(missingParam))
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError(missingParam))
      )
    })

    test('Shoud return 500 if Validation throws', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
  })

  describe('DeletePostUseCase', () => {
    test('Shoud call DeletePostUseCase with correct values', async () => {
      const { sut, deletePostUseCaseStub } = makeSut()
      const updateSpy = jest.spyOn(deletePostUseCaseStub, 'delete')
      await sut.handle(request)
      expect(updateSpy).toHaveBeenCalledWith(deletePostRequestEntity)
    })

    test('Shoud return 500 if DeletePostUseCase throws', async () => {
      const { sut, deletePostUseCaseStub } = makeSut()
      jest
        .spyOn(deletePostUseCaseStub, 'delete')
        .mockImplementationOnce(async () => {
          return await Promise.reject(new Error())
        })
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
    const { sut, deletePostUseCaseStub } = makeSut()
    jest
      .spyOn(deletePostUseCaseStub, 'delete')
      .mockImplementationOnce(async () => {
        return await Promise.resolve(ResultEnum.notFound)
      })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(notFound(new NotFoundError(request.body.id)))
  })

  test('Shoud return 403 if post dont belong to the user', async () => {
    const { sut, deletePostUseCaseStub } = makeSut()
    jest
      .spyOn(deletePostUseCaseStub, 'delete')
      .mockImplementationOnce(async () => {
        return await Promise.resolve(ResultEnum.forbidden)
      })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new UnauthorizedError()))
  })
})
