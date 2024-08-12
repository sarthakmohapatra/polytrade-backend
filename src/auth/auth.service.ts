import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validating user with email: ${email}`);
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        this.logger.log(`User validated successfully: ${email}`);
        return result; // Ensure that result contains the role
      }
      this.logger.warn(`User validation failed: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to validate user with email: ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  async login(user: any) {
    try {
      this.logger.log(`Attempting to log in user with email: ${user.email}`);
      const user_data = await this.userService.findByEmail(user.email);
      if (!user_data) {
        this.logger.warn(`No user found with email: ${user.email}`);
        throw new NotFoundException('No such user exists');
      }

      const payload = {
        email: user.email,
        sub: user_data.id,
        role: user_data.role,
      };
      this.logger.log(`User logged in successfully: ${user.email}`);
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(
        `Failed to log in user with email: ${user.email}`,
        error.stack,
      );
      throw error;
    }
  }
}
