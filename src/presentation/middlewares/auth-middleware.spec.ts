import {
  LoadAccountByTokenRequestEntity,
  LoadAccountByTokenResponseEntity
} from '../../domain/entities/users'
import { LoadAccountByTokenUseCase } from '../../domain/usecases/users/load-account-by-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'
import { AuthMiddleware } from './auth-middleware'

import faker from 'faker'
import { HttpRequest } from '../protocols'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByTokenUseCase
}

const id = faker.datatype.uuid()
const accessToken = 'any_token'

const request: HttpRequest = {
  headers: {
    'x-access-token': accessToken
  }
}

const loadAccountRequest: LoadAccountByTokenRequestEntity = { accessToken }
const loadAccountResponse: LoadAccountByTokenResponseEntity = { id }

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

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct access token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(loadAccountRequest)
  })

  test('Should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockResolvedValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()))
  })
})
