import { CustomError } from '../protocols/custom_error'

export class ParamLengthError extends CustomError {
  errorCode: string
  constructor (paramName: string, minLength: number, maxLength: number) {
    super(
      `${paramName} must be between ${minLength} and ${maxLength} characters `
    )
    this.name = 'ParamLengthError'
    this.errorCode = `length_error_${paramName}`
  }
}
