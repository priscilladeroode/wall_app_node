export class NotFoundError extends Error {
  constructor (paramName: string) {
    super(`Can't find: ${paramName}`)
    this.name = 'NotFoundError'
  }
}
