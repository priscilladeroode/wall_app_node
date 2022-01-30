import { ParamLengthError } from '@/presentation/errors/param-length-error'
import { CustomError } from '@/presentation/protocols/custom_error'
import { Validation } from '@/presentation/protocols/validation'

export class LengthFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly minLenght: number,
    private readonly maxLenght: number
  ) {}

  validate (input: any): CustomError {
    if (this.minLenght) {
      if (input[this.fieldName].lenght < this.minLenght) {
        return new ParamLengthError(
          this.fieldName,
          this.minLenght,
          this.maxLenght
        )
      }
    }
    if (this.maxLenght) {
      if (input[this.fieldName].lenght > this.maxLenght) {
        return new ParamLengthError(
          this.fieldName,
          this.minLenght,
          this.maxLenght
        )
      }
    }
  }
}
