import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const credential = username.trim();
    const user = await this.userService.findByUsername(credential);
    if (!user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    // Support both bcrypt hash and plain text fallback.
    const isBcryptHash =
      user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    const isValidPassword = isBcryptHash
      ? await compare(password, user.password)
      : user.password === password;

    if (!isValidPassword) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const normalizedUsername = dto.username.trim();
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedFullName = dto.fullName.trim();

    const existedByUsername =
      await this.userService.findByExactUsername(normalizedUsername);
    if (existedByUsername) {
      throw new ConflictException('Tên tài khoản đã tồn tại');
    }

    const existedByEmail = await this.userService.findByEmail(normalizedEmail);
    if (existedByEmail) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const user = await this.userService.createUser({
      username: normalizedUsername,
      password: await hash(dto.password, 10),
      fullName: normalizedFullName,
      email: normalizedEmail,
      role: 'surveyor',
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
