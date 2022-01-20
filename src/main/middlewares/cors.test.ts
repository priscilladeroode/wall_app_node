import request from 'supertest'
import app from '../../../src/main/config/app'

describe('CORS middleware', () => {
  test('Should enable CORS', async () => {
    app.post('/test-cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
