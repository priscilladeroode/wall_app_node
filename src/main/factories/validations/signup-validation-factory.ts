import { RequiredFieldValidation } from '../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../validations/validators/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
