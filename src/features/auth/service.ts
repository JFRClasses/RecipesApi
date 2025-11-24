import { inject, injectable } from "tsyringe";
import { CryptService } from "../../services/crypt.service";
import { User } from "../../models/User";
import { AppDataSource } from "../../models/index";

@injectable()
export class AuthService {
  constructor(@inject(CryptService) private readonly crypt: CryptService) {}

  async register(name: string, email: string, password: string) {
    console.log(`[AuthService] register called. Email=${email}`);

    if (!name || !email || !password) {
      const err: any = new Error(
        "El nombre, correo y contraseña son obligatorios."
      );
      err.status = 400;
      throw err;
    }

    name = name.trim();
    email = email.trim();

    if (name.length === 0 || email.length === 0 || password.length === 0) {
      const err: any = new Error(
        "El nombre, correo y contraseña no pueden estar vacíos."
      );
      err.status = 400;
      throw err;
    }

    if (/\s/.test(email)) {
      const err: any = new Error(
        "El correo no deben contener espacios en blanco."
      );
      err.status = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const err: any = new Error(
        "El formato del correo electrónico no es válido."
      );
      err.status = 400;
      throw err;
    }

    const existing = await AppDataSource.manager.findOne(User, {
      where: { email },
    });
    if (existing) {
      const err: any = new Error("El correo electrónico ya está en uso.");
      err.status = 409;
      console.warn("[AuthService] Registration attempt with existing email");
      throw err;
    }

    const hashed = await this.crypt.hashPassword(password);
    const user = AppDataSource.manager.create(User, {
      name,
      email,
      password: hashed,
    });
    const saved = await AppDataSource.manager.save(User, user);

    console.log(`[AuthService] User created with id=${saved.id}`);
    return {
      message: "Usuario registrado correctamente.",
      isLogged: true,
      userId: saved.id,
    };
  }

  async login(email: string, password: string) {
    console.log(`[AuthService] login called. Email=${email}`);
    const user = await AppDataSource.manager.findOne(User, {
      where: { email },
    });
    if (!user) {
      const err: any = new Error("Credenciales invalidas");
      err.status = 401;
      console.warn("[AuthService] Login failed: user not found");
      throw err;
    }

    const ok = await this.crypt.comparePasswords(password, user.password);
    if (!ok) {
      const err: any = new Error("Credenciales Invalidas");
      err.status = 401;
      console.warn("[AuthService] Login failed: wrong password");
      throw err;
    }
    console.log(`[AuthService] Login success for userId=${user.id}`);
    return { message: "User logged", userId: user.id, isLogged: true };
  }
}
