import faker from 'faker'

import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from '@/presentation/errors'
import { SignUpController } from '@/presentation/controllers/users/signup-controller'

import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http'
import { ValidationSpy } from '../../mocks/mock-validation'
import {
  AddAccountSpy,
  AuthenticationUseCaseSpy
} from '../../mocks/mock-account'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationUseCaseSpy
}

const fakePassword = faker.internet.password()
const request = {
  body: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: fakePassword,
    passwordConfirmation: fakePassword
  }
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationUseCaseSpy()
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  )
  return { sut, addAccountSpy, validationSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
  test('Shoud call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const addSpy = jest.spyOn(addAccountSpy, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.body.name,
      email: request.body.email.toLowerCase(),
      password: request.body.password
    })
  })

  test('Shoud return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const httpRequest = request
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 200 if valid data is provided', async () => {
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
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 403 if AddAccount returns false', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = { registered: false }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
