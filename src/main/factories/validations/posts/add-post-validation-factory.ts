import { Validation } from '../../../../presentation/protocols/validation'
import { TypeFieldValidation } from '../../../../validations/validators'
import { LengthFieldValidation } from '../../../../validations/validators/length-field-validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'

export const makeAddPostValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['title', 'uid', 'content']) {
    validations.push(new RequiredFieldValidation(field))
    validations.push(new TypeFieldValidation(field, 'string'))
  }
  validations.push(new LengthFieldValidation('title', 10, 150))
  validations.push(new LengthFieldValidation('content', 200, 3000))
  return new ValidationComposite(validations)
}
