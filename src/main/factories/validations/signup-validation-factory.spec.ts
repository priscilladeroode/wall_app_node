import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../validations/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../validations/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
