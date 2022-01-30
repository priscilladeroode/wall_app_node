import validator from 'validator'
import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { CustomError } from '@/presentation/protocols/custom_error'

export class CompleteNameFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): CustomError {
    if (
      !validator.matches(
        input[this.fieldName],
        '(^[A-Za-z]{3,16})([ ]{1})([A-Za-z]{1,16})?([ ]{1})?([A-Za-z]{1,16})?([ ]{1})?([A-Za-z]{1,16})'
      )
    ) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
