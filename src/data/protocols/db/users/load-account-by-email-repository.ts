import {
  LoadAccountRequestModel,
  LoadAccountResponseModel
} from '../../../models/users'

export interface LoadAccountByEmailRepository {
  load: (
    accountData: LoadAccountRequestModel
  ) => Promise<LoadAccountResponseModel>
}
