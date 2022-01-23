import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../validations/protocols/email-validator'
import { CompleteNameFieldValidation } from '../../../../validations/validators'
import { CompareFieldsValidation } from '../../../../validations/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validations/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validations/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new CompleteNameFieldValidation('name'))

    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
