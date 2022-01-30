import { MissingParamError } from '@/presentation/errors'
import { CustomError } from '@/presentation/protocols/custom_error'
import { Validation } from '@/presentation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): CustomError {
    if (!(this.fieldName in input)) {
      return new MissingParamError(this.fieldName)
    }
  }
}
