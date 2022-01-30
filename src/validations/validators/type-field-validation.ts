import { InvalidParamError } from '@/presentation/errors'
import { CustomError } from '@/presentation/protocols/custom_error'
import { Validation } from '@/presentation/protocols/validation'

export class TypeFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldType: string
  ) {}

  validate (input: any): CustomError {
    // eslint-disable-next-line valid-typeof
    if (typeof input[this.fieldName] !== this.fieldType) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
