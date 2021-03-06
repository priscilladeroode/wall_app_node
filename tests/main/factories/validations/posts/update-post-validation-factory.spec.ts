import { Validation } from '@/presentation/protocols/validation'
import {
  LengthFieldValidation,
  RequiredFieldValidation,
  TypeFieldValidation,
  ValidationComposite
} from '@/validations/validators'
import { makeUpdatePostValidation } from '@/main/factories/validations/posts/update-post-validation-factory'

jest.mock('@/validations/validators/validation-composite')

describe('UpdatePostValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUpdatePostValidation()
    const validations: Validation[] = []

    for (const field of ['title', 'uid', 'content', 'id']) {
      validations.push(new RequiredFieldValidation(field))
      validations.push(new TypeFieldValidation(field, 'string'))
    }
    validations.push(new LengthFieldValidation('title', 3, 150))
    validations.push(new LengthFieldValidation('content', 10, 3000))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
