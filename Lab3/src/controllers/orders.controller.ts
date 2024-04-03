import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto } from '../models';
import { UserLeanDoc } from '../schema';

@Controller({ path: '/orders' })
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.orderService.createOrder({
        ...body,
        login: user.login,
      });
      return order;
    } catch (err) {
      throw err;
    }
  }
}
