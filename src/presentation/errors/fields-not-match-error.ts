import { CustomError } from '../protocols/custom_error'

export class FieldNotMatchError extends CustomError {
  errorCode: string
  constructor (paramName: string, secondParamName: string) {
    super(`FieldNotMatch ${paramName}`)
    this.name = 'FieldNotMatchError'
    this.message = `The ${paramName} don't match with ${secondParamName}`
    this.errorCode = `${paramName}_dont_match`
  }
}
