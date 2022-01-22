import {
  LoadAccountByTokenRequestEntity,
  LoadAccountByTokenResponseEntity
} from '../../domain/entities/users'
import { LoadAccountByTokenUseCase } from '../../domain/usecases/users/load-account-by-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http'
import { AuthMiddleware } from './auth-middleware'

import faker from 'faker'
import { HttpRequest } from '../protocols'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByTokenUseCase
}

const uid = faker.datatype.uuid()
const accessToken = 'any_token'

const request: HttpRequest = {
  headers: {
    'x-access-token': accessToken
  }
}

const loadAccountRequest: LoadAccountByTokenRequestEntity = { accessToken }
const loadAccountResponse: LoadAccountByTokenResponseEntity = { uid }

const makeLoadAccountByToken = (): LoadAccountByTokenUseCase => {
  class LoadAccountByTokenStub implements LoadAccountByTokenUseCase {
    async loadByToken (
      entity: LoadAccountByTokenRequestEntity
    ): Promise<LoadAccountByTokenResponseEntity> {
      return await Promise.resolve(loadAccountResponse)
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

export const throwError = (): never => {
  throw new Error()
}

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByTokenUseCase with correct access token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(loadAccountRequest)
  })

  test('Should return 403 if LoadAccountByTokenUseCase returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockResolvedValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByTokenUseCase returns an id', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toStrictEqual(ok(loadAccountResponse))
  })

  test('Should return 500 if LoadAccountByTokenUseCase throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
