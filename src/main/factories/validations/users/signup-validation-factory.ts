import { Validation } from '../../../../presentation/protocols/validation'
import {
  CompleteNameFieldValidation,
  EmailValidatorAdapter,
  EmailValidation,
  CompareFieldsValidation,
  ValidationComposite,
  RequiredFieldValidation,
  LengthFieldValidation
} from '../../../../validations/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new CompleteNameFieldValidation('name'))
  validations.push(new LengthFieldValidation('password', 6, 10))

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
