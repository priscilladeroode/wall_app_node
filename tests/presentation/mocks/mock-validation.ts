import { Validation } from '@/presentation/protocols/validation'
import { CustomError } from '../protocols/custom_error'

export class ValidationSpy implements Validation {
  error: CustomError = null
  input: any

  validate (input: any): CustomError {
    this.input = input
    return this.error
  }
}
