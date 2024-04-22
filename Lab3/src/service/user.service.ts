import { Injectable } from '@nestjs/common';
import { AdminDto, LoginDto, UserDto, DriverDto } from '../models';
import { UserDoc, Users } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound } from '../shared';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {

    const role = 'Customer';
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }
    // const doc = new this.orderModel({
    //   ...body,
    //   price,
    //   distance,
    // });
    /**
     * Validation of data
     */
    const doc = new this.userModel({
      ...body,
      role,
    });
    /**
     * Save to db
     */
    const user = await doc.save();

    return user.toObject();
  }

  async createAdmin(body: AdminDto) {

    const role = 'Admin';
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }

    const doc = new this.userModel({
      ...body,
      role,
    });

    const user = await doc.save();

    return user.toObject();
  }

  async createDriver(body: DriverDto) {

    const role = 'Driver';
    const isExists = await this.userModel.findOne({
      login: body.login,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `User with login ${body.login} already exists`,
      );
    }

    const doc = new this.userModel({
      ...body,
      role,
    });

    const user = await doc.save();

    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      login: body.login,
      password: body.password,
    });

    if (!user) {
      throw new UserNotFound(`User with login ${body.login} was not found`);
    }

    user.token = randomUUID();

    await user.save();

    return user.token;
  }

  async getAllUsers() {
    const users = await this.userModel.find(
      {},
      { token: false, password: false, login: false },
    );

    return users.map((user) => user.toObject());
  }

  async getUsersForCustomer(body: UserDto){
    const users = await this.userModel.find(
      {login: body.login},
      { token: false, password: false, login: false },
    );

  }

  
}
