import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { makeLoadPostByIdValidation } from './load-post-by-id-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('LoadPostByIdValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoadPostByIdValidation()
    const validations: Validation[] = []

    for (const field of ['id']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
