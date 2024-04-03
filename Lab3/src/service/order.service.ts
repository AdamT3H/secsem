import { Injectable } from '@nestjs/common';
import { OrderDto } from '../models';
import { Orders, OrdersDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,
  ) {}

  async createOrder(body: OrderDto & { login: string }) {
    const price = 50;

    const doc = new this.orderModel({
      ...body,
      price,
    });

    const order = await doc.save();

    return order;
  }
}
