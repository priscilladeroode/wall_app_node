import { SendWelcomeEmailRequestModel } from '@/data/models/services/send-welcome-email-request-model'

export interface SendWelcomeEmailRepository {
  send: (model: SendWelcomeEmailRequestModel) => Promise<void>
}
