import { Validation } from '@/presentation/protocols/validation'
import {
  TypeFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validations/validators'

export const makeLoadPostsByUidValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['uid']) {
    validations.push(new RequiredFieldValidation(field))
    validations.push(new TypeFieldValidation(field, 'string'))
  }
  return new ValidationComposite(validations)
}
