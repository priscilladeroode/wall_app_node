import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class TypeFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldType: string
  ) {}

  validate (input: any): Error {
    // eslint-disable-next-line valid-typeof
    if (typeof input[this.fieldName] !== this.fieldType) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
