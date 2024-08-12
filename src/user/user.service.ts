import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      this.logger.log('Module initialization - Seeding admin user');
      await this.seedAdminUser();
    } catch (error) {
      this.logger.error('Failed to seed admin user', error.stack);
      throw error;
    }
  }

  private async seedAdminUser() {
    try {
      const adminEmail = 'admin@example.com';
      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        this.logger.log(
          `No admin user found, creating admin user with email: ${adminEmail}`,
        );
        const hashedPassword = await bcrypt.hash('yourAdminPassword', 10);
        await this.prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            role: Role.ADMIN,
          },
        });
        this.logger.log('Admin user created successfully');
      } else {
        this.logger.log('Admin user already exists');
      }
    } catch (error) {
      this.logger.error('Failed to seed admin user', error.stack);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    this.logger.log(`Registering new user with email: ${email}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.USER,
        },
      });
      this.logger.log(`User registered successfully with email: ${email}`);
      return newUser;
    } catch (error) {
      this.logger.error(
        `Failed to register user with email: ${email} - Email already in use`,
        error.stack,
      );
      throw new ConflictException('Email already in use');
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.log(`Finding user with email: ${email}`);
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found with email: ${email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to find user with email: ${email}`,
        error.stack,
      );
      throw error;
    }
  }
}
