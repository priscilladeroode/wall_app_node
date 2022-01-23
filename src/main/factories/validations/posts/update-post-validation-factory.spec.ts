import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { makeUpdatePostValidation } from './update-post-validation-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('UpdatePostValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUpdatePostValidation()
    const validations: Validation[] = []

    for (const field of ['title', 'uid', 'content', 'id']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
