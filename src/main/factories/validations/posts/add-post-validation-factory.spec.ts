import { Validation } from '../../../../presentation/protocols/validation'
import { LengthFieldValidation } from '../../../../validations/validators'
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
    validations.push(new LengthFieldValidation('title', 10, 150))
    validations.push(new LengthFieldValidation('content', 200, 3000))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
