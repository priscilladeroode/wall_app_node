import { CustomError } from '../protocols/custom_error'

export class ParamLengthError extends CustomError {
  errorCode: string
  constructor (paramName: string, minLenght: number, maxLenght: number) {
    super(
      `${paramName} must be between ${minLenght} and ${maxLenght} characters `
    )
    this.name = 'ParamLengthError'
    this.errorCode = `lenght_error_${paramName}`
  }
}
