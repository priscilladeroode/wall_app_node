import faker from 'faker'

import { MissingParamError, ServerError } from '@/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers/http'
import { SignInController } from '@/presentation/controllers/users/signin-controller'
import { ValidationSpy } from '../../mocks/mock-validation'
import { AuthenticationUseCaseSpy } from '../../mocks/mock-account'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: SignInController
  authenticationSpy: AuthenticationUseCaseSpy
  validationSpy: ValidationSpy
}

const email = faker.internet.email()

const request = {
  body: {
    email,
    password: faker.internet.password()
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationUseCaseSpy()
  const sut = new SignInController(validationSpy, authenticationSpy)
  return { sut, authenticationSpy, validationSpy }
}

describe('Sign In Controller', () => {
  test('Shoud call AuthenticationUseCase with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const addSpy = jest.spyOn(authenticationSpy, 'auth')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      email: request.body.email.toLowerCase(),
      password: request.body.password
    })
  })

  test('Shoud return 500 if AuthenticationUseCase throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Shoud return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })

  test('Shoud call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Shoud return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError('any_field')
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
