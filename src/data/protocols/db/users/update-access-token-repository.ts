import { UpdateAccessTokenRequestModel } from '../../../models/users/update-access-token-request-model'

export class UpdateAccessTokenRepository {
  update: (data: UpdateAccessTokenRequestModel) => Promise<void>
}
