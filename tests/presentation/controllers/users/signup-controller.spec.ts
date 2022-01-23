import {
  AddAccountRequestEntity,
  AddAccountResponseEntity,
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '@/domain/entities/users'
import { AddAccount } from '@/domain/usecases/users'
import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from '@/presentation/errors'
import { SignUpController } from '@/presentation/controllers/users/signup-controller'

import faker from 'faker'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http'
import { Validation } from '@/presentation/protocols/validation'
import { AuthenticationUseCase } from '@/domain/usecases/users/authentication-usecase'
import { ValidationSpy } from '../../mocks/mock-validation'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationSpy: Validation
  authenticationStub: AuthenticationUseCase
}

const fakePassword = faker.internet.password()
const email = faker.internet.email()
const fakeRequest = {
  body: {
    name: faker.name.findName(),
    email,
    password: fakePassword,
    passwordConfirmation: fakePassword
  }
}

const fakeResponse = {
  name: faker.name.findName(),
  email,
  accessToken: 'any_accessToken'
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (
      account: AddAccountRequestEntity
    ): Promise<AddAccountResponseEntity> {
      return await Promise.resolve({ registered: true })
    }
  }
  return new AddAccountStub()
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
  const authenticationStub = makeAuthentication()
  const validationSpy = new ValidationSpy()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(
    addAccountStub,
    validationSpy,
    authenticationStub
  )
  return {
    sut,
    addAccountStub,
    validationSpy,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Shoud call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = fakeRequest
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: fakeRequest.body.name,
      email: fakeRequest.body.email.toLowerCase(),
      password: fakeRequest.body.password
    })
  })

  test('Shoud return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 200 if valid data is provided', async () => {
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

  test('Shoud return 403 if AddAccount returns false', async () => {
    const { sut, addAccountStub } = makeSut()
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(
        async () => await Promise.resolve({ registered: false })
      )
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
