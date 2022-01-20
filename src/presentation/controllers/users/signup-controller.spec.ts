import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { EmailValidator } from '../../../validations/protocols/email-validator'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup-controller'

import faker from 'faker'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Validation } from '../../protocols/validation'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const fakeMessage = {
  message: 'User successfully registered'
}

const fakePassword = faker.internet.password()

const fakeRequest = {
  body: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: fakePassword,
    passwordConfirmation: fakePassword
  }
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  )
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Shoud return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Shoud call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = fakeRequest
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(
      fakeRequest.body.email.toLowerCase()
    )
  })

  test('Shoud return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = fakeRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

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
})
