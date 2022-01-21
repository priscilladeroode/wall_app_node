import {
  LoadAccountRequestModel,
  LoadAccountResponseModel
} from '../../../models/users'

export interface LoadAccountByEmailRepository {
  loadByEmail: (
    accountData: LoadAccountRequestModel
  ) => Promise<LoadAccountResponseModel>
}
