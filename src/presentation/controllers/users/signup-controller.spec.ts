import {
  AddAccountRequestEntity,
  AddAccountResponseEntity,
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup-controller'

import faker from 'faker'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Validation } from '../../protocols/validation'
import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: AuthenticationUseCase
}

const fakeMessage = {
  message: 'User successfully registered'
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
      return await Promise.resolve(fakeMessage)
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
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
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )
  return {
    sut,
    addAccountStub,
    validationStub,
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
    expect(httpResponse).toEqual(ok(fakeMessage))
  })

  test('Shoud call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fakeRequest
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Shoud return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
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
})
