import { BadRequestException, Param, Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto, UpdateDto, UserDto } from '../models';
import { UserLeanDoc, OrdersLeanDoc } from '../schema';
import { WrongType } from 'src/shared';

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

      // const bodyFromPoint = body.from

      // // const FindToAddressInBd = address.name
      // console.log(user)

      

      // const брати значення з боді, яке ми передаємо, і робити пошук по базі даних, за цим значенням, якщо ффейл, то вертайм помилку, якщо тру, то продовжуєм далі код який вже є

      const order = await this.orderService.createOrder({
        ...body,
        login: user.login,
      });

      console.log(user)

      return order;
    } catch (err) {
       if (err instanceof WrongType) {
        throw new BadRequestException(err.toString())
       }
      
      throw err;
    }
  }


  @Get('/from')
  async getFiveLastFrom(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const {user} = req;
      const order = await this.orderService.getFiveLastFrom(user);
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/to')
  async getThreeLastToPints(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const {user} = req;
      const order = await this.orderService.getThreeLastToPints(user);
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/lowestPrice')
  async getLowesPrice(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const {user} = req;
      const order = await this.orderService.getLowesPrice(user);
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/biggestPrice')
  async getBiggestPrice() {
    try {
      const order = await this.orderService.getBiggestPrice();
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/ordersForCustomer')
  async getOrdersForCustomer(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      const order = await this.orderService.getOrdersForCustomer(user);
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/ordersForDriver')
  async getOrdersForDriver() {
    try {
      const order = await this.orderService.getOrdersForDriver();
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/ordersForAdmin')
  async getOrdersForAdmin() {
    try {
      const order = await this.orderService.getOrdersForAdmin();
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:orderId')
  async updateOrderStatus(
  @Param('orderId') orderId: string,
  @Req() req: Request & { user: UserLeanDoc },
  @Body() body: UpdateDto

  ){ 
    try {
      const {user} = req;
      console.log("III", body);
      const updateOrder = await this.orderService.updateOrderStatus(orderId, user, body);
      return updateOrder;
    }
    catch (err) {
      throw err;
    }
  }

}
