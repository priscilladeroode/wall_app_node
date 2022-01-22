import { Validation } from '../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../validations/validators/required-field-validation'
import { ValidationComposite } from '../../../../validations/validators/validation-composite'
import { makeAddPostValidation } from './add-post-validation-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('AddPostValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddPostValidation()
    const validations: Validation[] = []

    for (const field of ['title', 'uid', 'content']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
