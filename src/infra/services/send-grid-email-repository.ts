import axios from 'axios'
import { SendWelcomeEmailRepository } from '../../data/protocols/services/send-welcome-email-repository'
import env from '@/main/config/env'
import { SendWelcomeEmailRequestModel } from '@/data/models/services/send-welcome-email-request-model'

const headers = {
  Authorization: `Bearer ${env.sendGrid}`,
  'Content-Type': 'application/json'
}

export class SendGridEmailRepository implements SendWelcomeEmailRepository {
  async send (model: SendWelcomeEmailRequestModel): Promise<void> {
    await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'wallapp2022@gmail.com'
        },
        personalizations: [
          {
            to: [
              {
                email: model.email
              }
            ],
            dynamic_template_data: {
              name: model.name
            }
          }
        ],
        template_id: 'd-f2d6cc4a265e41e6a086145f982b4c40'
      },
      {
        headers: headers
      }
    )
  }
}
