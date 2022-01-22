import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { Validation } from '../../../../presentation/protocols/validation'
import { CompareFieldsValidation } from '../../../../validations/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validations/validators/email-validation'
import { EmailValidatorAdapter } from '../../../../validations/validators/email-validator'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
