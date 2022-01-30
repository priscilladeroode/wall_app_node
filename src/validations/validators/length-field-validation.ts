import { ParamLengthError } from '@/presentation/errors/param-length-error'
import { CustomError } from '@/presentation/protocols/custom_error'
import { Validation } from '@/presentation/protocols/validation'

export class LengthFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly minLength: number,
    private readonly maxLength: number
  ) {}

  validate (input: any): CustomError {
    if (this.minLength) {
      if (input[this.fieldName].length < this.minLength) {
        return new ParamLengthError(
          this.fieldName,
          this.minLength,
          this.maxLength
        )
      }
    }
    if (this.maxLength) {
      if (input[this.fieldName].length > this.maxLength) {
        return new ParamLengthError(
          this.fieldName,
          this.minLength,
          this.maxLength
        )
      }
    }
  }
}
