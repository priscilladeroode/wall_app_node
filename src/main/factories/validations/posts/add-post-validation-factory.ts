import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'

export const makeAddPostValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['title', 'uid', 'content']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
