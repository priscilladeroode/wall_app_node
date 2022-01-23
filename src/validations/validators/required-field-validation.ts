import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error {
    if (!(this.fieldName in input)) {
      return new MissingParamError(this.fieldName)
    }
  }
}
