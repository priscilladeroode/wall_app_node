import {
  AddAccountRequestModel,
  AddAccountResponseModel
} from '../../../models/users'

export interface AddAccountRepository {
  add: (accountData: AddAccountRequestModel) => Promise<AddAccountResponseModel>
}
