import { SendGridEmailRepository } from './send-grid-email-repository'

import axios from 'axios'

jest.mock('axios', () => ({
  async post (): Promise<string> {
    return await Promise.resolve('')
  }
}))

const makeSut = (): SendGridEmailRepository => {
  return new SendGridEmailRepository()
}

const throwError = (): never => {
  throw new Error()
}

const email = 'any_email@gmail.com'
const name = 'any_name'

describe('Send Grid Email Repository', () => {
  test('Should not return on success', async () => {
    const sut = makeSut()
    const result = await sut.send(email, name)
    expect(result).toBeFalsy()
  })

  test('Should throw if axios throw', async () => {
    const sut = makeSut()
    jest.spyOn(axios, 'post').mockImplementationOnce(throwError)
    const promise = sut.send(email, name)
    await expect(promise).rejects.toThrow()
  })
})
