import { SendGridEmailRepository } from './send-grid-email-repository'

jest.mock('axios', () => ({
  async post (): Promise<string> {
    return await Promise.resolve('')
  }
}))

const makeSut = (): SendGridEmailRepository => {
  return new SendGridEmailRepository()
}

const email = 'any_email@gmail.com'
const name = 'any_name'

describe('Send Grid Email Repository', () => {
  test('Should not return on success', async () => {
    const sut = makeSut()
    const result = await sut.send(email, name)
    expect(result).toBeFalsy()
  })
})
