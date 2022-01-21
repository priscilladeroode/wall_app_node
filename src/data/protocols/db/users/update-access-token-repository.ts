import { UpdateAccessTokenRequestModel } from '../../../models/users/update-access-token-request-model'

export class UpdateAccessTokenRepository {
  updateAccessToken: (data: UpdateAccessTokenRequestModel) => Promise<void>
}
