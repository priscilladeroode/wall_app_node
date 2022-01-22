import {
  LoadAccountByTokenRequestModel,
  LoadAccountByTokenResponseModel
} from '../../../models/users'

export interface LoadAccountByTokenRepository {
  loadByToken: (
    model: LoadAccountByTokenRequestModel
  ) => Promise<LoadAccountByTokenResponseModel>
}
