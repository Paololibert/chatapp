import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    //console.log("User found:", user);

    if (user) {
      /* console.log("Password to validate:", password);
      console.log("Hashed password in DB:", user.password); */
      const isPasswordValid = await bcrypt.compare(password, user.password);
      //findOneconsole.log("Password is valid:", isPasswordValid);

      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = loginUserDto;
    //console.log('the pass:', password);

    const user = await this.validateUser(username, password);
    //console.log("the user in authlogin service",user);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    //console.log(typeof(userId));

    const user = await this.usersService.findById(+userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { username: user.username };
  }

  async decodeToken( userId: string): Promise<{username: string, id: number }>{
    const user = await this.usersService.findById(+userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { username: user.username, id: user.id };
  }

  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(userId, updateUserDto);
  }
}
