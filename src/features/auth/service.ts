import { inject, injectable } from "tsyringe";
import { CryptService } from "../../services/crypt.service";
import { User } from "../../models/User";
import { DataSource } from "typeorm";
import { AppDataSource } from '../../models/index';

@injectable()
export class AuthService {
  constructor(
    @inject(CryptService) private readonly crypt: CryptService
  ) {}

  async register(name: string, email: string, password: string) {
    console.log(`[AuthService] register called. Email=${email}`);
    const existing = await AppDataSource.manager.findOne(User, { where: { email } });
    if (existing) {
      const err: any = new Error('Email already in use');
      err.status = 409;
      console.warn('[AuthService] Registration attempt with existing email');
      throw err;
    }

    const hashed = await this.crypt.hashPassword(password);
    const user = AppDataSource.manager.create(User, { name, email, password: hashed });
    const saved = await AppDataSource.manager.save(User, user);
    console.log(`[AuthService] User created with id=${saved.id}`);
    return { message: 'User created successfully', isLogged:true, userId: saved.id };
  }

  async login(email: string, password: string) {
    console.log(`[AuthService] login called. Email=${email}`);
    const user = await AppDataSource.manager.findOne(User, { where: { email } });
    if (!user) {
      const err: any = new Error('Invalid credentials');
      err.status = 401;
      console.warn('[AuthService] Login failed: user not found');
      throw err;
    }

    const ok = await this.crypt.comparePasswords(password, user.password);
    if (!ok) {
      const err: any = new Error('Credenciales Invalidas');
      err.status = 401;
      console.warn('[AuthService] Login failed: wrong password');
      throw err;
    }
    console.log(`[AuthService] Login success for userId=${user.id}`);
    return { message:"User logged", userId: user.id, isLogged: true };
  }
}