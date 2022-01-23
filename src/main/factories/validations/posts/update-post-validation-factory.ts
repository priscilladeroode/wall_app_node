import { Validation } from '../../../../presentation/protocols/validation'
import {
  LengthFieldValidation,
  RequiredFieldValidation,
  TypeFieldValidation,
  ValidationComposite
} from '../../../../validations/validators'

export const makeUpdatePostValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['title', 'uid', 'content', 'id']) {
    validations.push(new RequiredFieldValidation(field))
    validations.push(new TypeFieldValidation(field, 'string'))
  }
  validations.push(new LengthFieldValidation('title', 10, 150))
  validations.push(new LengthFieldValidation('content', 200, 3000))
  return new ValidationComposite(validations)
}
