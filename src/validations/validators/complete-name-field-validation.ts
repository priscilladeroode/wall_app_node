import validator from 'validator'
import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompleteNameFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
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
