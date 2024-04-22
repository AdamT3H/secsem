import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
} from '@nestjs/common';
import { UserService } from '../service';
import { LoginDto, UserDto, AdminDto, DriverDto } from '../models';
import { AdminAlreadyExists, UserAlreadyExists, UserNotFound } from '../shared';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async createUser(@Body() body: UserDto) {
    try {
      const result = await this.userService.createUser(body);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/admin')
  async createAdmin(@Body() body: AdminDto) {
    try {
      const result = await this.userService.createAdmin(body);
      return result;
    } catch (err) {
      if (err instanceof AdminAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/driver')
  async createDriver(@Body() body: DriverDto) {
    try {
      const result = await this.userService.createDriver(body);
      return result;
    } catch (err) {
      if (err instanceof AdminAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }


  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      const result = await this.userService.login(body);
      return { token: result };
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }



  
}
