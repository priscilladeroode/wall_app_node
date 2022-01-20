import request from 'supertest'
import app from '../../../src/main/config/app'

describe('SignUp Routes', () => {
  test('Should return a message on success', async () => {
    await request(app)
      .post('/api/register')
      .send({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password@mail.com',
        passwordConfirmation: 'any_password@mail.com'
      })
      .expect(200)
  })
})
