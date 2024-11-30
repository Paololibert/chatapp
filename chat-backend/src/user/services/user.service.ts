import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    
    try {
      const { username, password } = createUserDto;
      const exist = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (exist) {
        throw new ConflictException('This username alredy exists');
      }
      const saltOrRounds = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, saltOrRounds);
      const user = await this.prisma.user.create({
        data: {
          username: username,
          password: hash,
        },
      });
      return user;
    } catch (error) {}
  }


  async findOne(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, password } = updateUserDto;
    const userIdInt = parseInt(userId)
    const user = await this.prisma.user.findUnique({
      where: { id: userIdInt },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== userIdInt) {
        throw new ConflictException('This username already exists');
      }
    }

    let hashedPassword = user.password;
    if (password) {
      const saltOrRounds = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(password, saltOrRounds);
    }

    return await this.prisma.user.update({
      where: { id: userIdInt },
      data: {
        username: username || user.username,
        password: hashedPassword,
      },
    });
  }
}
