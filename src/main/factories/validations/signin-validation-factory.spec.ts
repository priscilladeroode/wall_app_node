import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../validations/protocols/email-validator'
import { EmailValidation } from '../../../validations/validators/email-validation'
import { RequiredFieldValidation } from '../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../validations/validators/validation-composite'
import { makeSignInValidation } from './signin-validation-factory'

jest.mock('../../../validations/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignInValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignInValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
