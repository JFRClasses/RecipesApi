import * as bcrypt from 'bcrypt';
import { singleton } from 'tsyringe';


@singleton()
export class CryptService {
  private readonly saltRounds = 10;
  async hashPassword(password: string){ const s = await bcrypt.genSalt(this.saltRounds); return bcrypt.hash(password, s); }
  async comparePasswords(password: string, hash: string){ return bcrypt.compare(password, hash); }
}