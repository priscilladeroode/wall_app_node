import { Validation } from '@/presentation/protocols/validation'
import {
  TypeFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validations/validators'
import { makeDeletePostByIdValidation } from '@/main/factories/validations/posts/delete-post-by-id-validation-factory'

jest.mock('@/validations/validators/validation-composite')

describe('DeletePostByIdValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeDeletePostByIdValidation()
    const validations: Validation[] = []

    for (const field of ['uid', 'id']) {
      validations.push(new RequiredFieldValidation(field))
      validations.push(new TypeFieldValidation(field, 'string'))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
