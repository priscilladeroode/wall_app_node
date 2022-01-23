import faker from 'faker'
import axios from 'axios'

import { SendGridEmailRepository } from '@/infra/services/send-grid-email-repository'

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

const email = faker.internet.email()
const name = faker.name.findName()

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
