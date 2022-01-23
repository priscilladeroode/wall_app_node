export class ParamLengthError extends Error {
  constructor (paramName: string, minLenght: number, maxLenght: number) {
    super(
      `Invalid param: ${paramName} must be between ${minLenght} and ${maxLenght} characters `
    )
    this.name = 'ParamLengthError'
  }
}
