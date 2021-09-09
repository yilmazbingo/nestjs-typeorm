import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

// Auth service needs User Service
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // randomBytes(8) returns a buffer which holds some raw data. we turn it into hex. every byte is 2 hex character. so solt will be 16 chars.
    const salt = randomBytes(8).toString('hex');
    // 32 means just give me the 32 charc as output
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // since hash is buffer convert it to string to concatenate
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    return user;
  }
  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}
