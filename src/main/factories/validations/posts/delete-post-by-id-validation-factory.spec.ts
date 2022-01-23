import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { makeDeletePostByIdValidation } from './delete-post-by-id-validation-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('DeletePostByIdValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeDeletePostByIdValidation()
    const validations: Validation[] = []

    for (const field of ['uid', 'id']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
