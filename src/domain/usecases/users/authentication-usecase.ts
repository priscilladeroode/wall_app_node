import {
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '../../entities/users'

export interface AuthenticationUseCase {
  auth: (
    authRequestEntity: AuthenticationRequestEntity
  ) => Promise<AuthenticationResponseEntity>
}
