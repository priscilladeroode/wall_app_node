import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { Middleware } from '@/presentation/protocols/middlewares'
import { makeLoadAccountByTokenUseCase } from '../usecases/users/load-account-by-token-usecase-factory'

export const makeAuth = (): Middleware => {
  const usecase = makeLoadAccountByTokenUseCase()
  return new AuthMiddleware(usecase)
}
