import { MissingParamError, ServerError } from '@/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers/http'
import { SignInController } from '@/presentation/controllers/users/signin-controller'

import faker from 'faker'
import {
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '@/domain/entities/users'
import { AuthenticationUseCase } from '@/domain/usecases/users/authentication-usecase'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationSpy } from '../../mocks/mock-validation'

type SutTypes = {
  sut: SignInController
  authenticationStub: AuthenticationUseCase
  validationSpy: Validation
}

const email = faker.internet.email()

const fakeRequest = {
  body: {
    email,
    password: faker.internet.password()
  }
}

const fakeResponse = {
  name: faker.name.findName(),
  email,
  accessToken: 'any_accessToken'
}

const makeAuthentication = (): AuthenticationUseCase => {
  class AuthenticationUseCaseStub implements AuthenticationUseCase {
    async auth (
      authRequestEntity: AuthenticationRequestEntity
    ): Promise<AuthenticationResponseEntity> {
      return await Promise.resolve(fakeResponse)
    }
  }
  return new AuthenticationUseCaseStub()
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationStub = makeAuthentication()
  const sut = new SignInController(validationSpy, authenticationStub)
  return {
    sut,
    authenticationStub,
    validationSpy
  }
}

describe('Sign In Controller', () => {
  test('Shoud call AuthenticationUseCase with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const addSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = fakeRequest
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      email: fakeRequest.body.email.toLowerCase(),
      password: fakeRequest.body.password
    })
  })

  test('Shoud return 500 if AuthenticationUseCase throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Shoud return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(fakeResponse))
  })

  test('Shoud call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = fakeRequest
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Shoud return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest
      .spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
