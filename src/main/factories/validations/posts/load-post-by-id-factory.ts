import { Validation } from '@/presentation/protocols/validation'
import {
  TypeFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validations/validators'

export const makeLoadPostByIdValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['id']) {
    validations.push(new RequiredFieldValidation(field))
    validations.push(new TypeFieldValidation(field, 'string'))
  }
  return new ValidationComposite(validations)
}
