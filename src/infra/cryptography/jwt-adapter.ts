import { Encrypter } from '../../data/protocols/cryptography/encrypter'

import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this.secret)
  }

  async decrypt (plaintext: string): Promise<string> {
    return jwt.verify(plaintext, this.secret) as any
  }
}
