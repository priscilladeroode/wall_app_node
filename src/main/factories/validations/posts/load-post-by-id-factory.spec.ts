import { Validation } from '../../../../presentation/protocols/validation'
import {
  TypeFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../validations/validators'
import { makeLoadPostByIdValidation } from './load-post-by-id-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('LoadPostByIdValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoadPostByIdValidation()
    const validations: Validation[] = []

    for (const field of ['id']) {
      validations.push(new RequiredFieldValidation(field))
      validations.push(new TypeFieldValidation(field, 'string'))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
