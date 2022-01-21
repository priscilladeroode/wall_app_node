export interface SendWelcomeEmailRepository {
  send: (email: string, name: string) => Promise<void>
}
