import { InvalidParamError } from '@/presentation/errors'
import { CustomError } from '@/presentation/protocols/custom_error'
import { Validation } from '@/presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: any): CustomError {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
