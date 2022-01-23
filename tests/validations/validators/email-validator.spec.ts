import faker from 'faker'
import validator from 'validator'

import { EmailValidatorAdapter } from '@/validations/validators/email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const email = faker.internet.email()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const email = faker.internet.email()
    const isValid = sut.isValid(email)
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email = faker.internet.email()
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
