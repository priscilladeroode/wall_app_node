import { Validation } from '../../../../presentation/protocols/validation'
import {
  LengthFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../validations/validators'
import { makeUpdatePostValidation } from './update-post-validation-factory'

jest.mock('../../../../validations/validators/validation-composite')

describe('UpdatePostValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUpdatePostValidation()
    const validations: Validation[] = []

    for (const field of ['title', 'uid', 'content', 'id']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new LengthFieldValidation('title', 10, 150))
    validations.push(new LengthFieldValidation('content', 200, 3000))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
