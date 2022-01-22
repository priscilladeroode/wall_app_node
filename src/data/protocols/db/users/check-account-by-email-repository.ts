import {
  CheckAccountRequestModel,
  CheckAccountResponseModel
} from '../../../models/users'

export interface CheckAccountByEmailRepository {
  checkByEmail: (
    data: CheckAccountRequestModel
  ) => Promise<CheckAccountResponseModel>
}
