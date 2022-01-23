import axios from 'axios'
import { SendWelcomeEmailRepository } from '../../data/protocols/services/send-welcome-email-repository'
import env from '@/main/config/env'

const headers = {
  Authorization: `Bearer ${env.sendGrid}`,
  'Content-Type': 'application/json'
}

export class SendGridEmailRepository implements SendWelcomeEmailRepository {
  async send (email: string, name: string): Promise<void> {
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
                email: email
              }
            ],
            dynamic_template_data: {
              name: name
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
