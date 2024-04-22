import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, Addresses, AddressesSchema, OrdersSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://UserAdam:Ogorodnik2006@cluster0.imsyknu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: '4CS-11' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Addresses.name,
        schema: AddressesSchema,
      },
    ]),
  ],
  controllers: [UsersController, OrdersController],
  providers: [UserService, OrderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
  }
}
