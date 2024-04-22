import { Injectable, Param } from '@nestjs/common';
import { OrderDto, UserDto, UpdateDto } from '../models';
import { Orders, Users, Addresses, OrdersDoc, UserDoc, AddressesDoc, AddressesLocation} from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDontHaneAnyOrders, UnavableAddress, WrongType, WrongStatusForUpdateUserStatus } from '../shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,

    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,

    @InjectModel(Addresses.name)
    private readonly addressModel: Model<AddressesDoc>,
  ) {}


  async createOrder(body: OrderDto & { login: string }) {
    const price = Math.floor(Math.random() * 81) + 20;

    const id = crypto.randomUUID();

    const findFromInDb = await this.addressModel.findOne({name:body.from},);
    const findToInDb = await this.addressModel.findOne({name:body.to},);

    if (findFromInDb === null || findToInDb === null){
      throw new UnavableAddress(`Can't find this addres in addresses DB.`);
    };

    function convertDegreestoRadians(coords: number){  // треба для того, щоб джава коректно обраховувала math. функції (формулу найшов в інеті, коментарі писав не JPT а я для себе)
      return coords * Math.PI / 180;
     };
    
     function distanceBetweenCoords(from: AddressesLocation, to: AddressesLocation){
      const { latitude: latitude1,longitude: longitude1} = from;
      const { latitude: latitude2,longitude: longitude2} = to;
      const latitudeInRadians1 = convertDegreestoRadians(latitude1);
      const latitudeInRadians2 = convertDegreestoRadians(latitude2);

      console.log(latitude1)
    
      const earthRadius = 6371;
    
      const diferanceLatitude = convertDegreestoRadians(latitude2 - latitude1);
      const diferancelongitude = convertDegreestoRadians(longitude2 - longitude1);
    
      const underRoot = Math.sin(diferanceLatitude / 2) * Math.sin(diferanceLatitude / 2) + Math.cos(latitudeInRadians1) * Math.cos(latitudeInRadians2) * Math.sin(diferancelongitude / 2) * Math.sin(diferancelongitude / 2);
      const inRoot = 2 * Math.asin(Math.sqrt(underRoot));
    
      return earthRadius * inRoot;
    
     };
    
     const latitude1 = findToInDb.location.latitude;
     const longitude1 = findToInDb.location.longitude;
     const latitude2 = findFromInDb.location.latitude;
     const longitude2 = findFromInDb.location.longitude;
    console.log(findToInDb, findFromInDb)
    let preDistance = distanceBetweenCoords(findToInDb.location, findFromInDb.location);

    // console.log(preDistance);

    if (body.type === "standart") {
      preDistance = preDistance * 2.5
    } else if (body.type === "lite"){
      preDistance = preDistance * 1.5
    } else if (body.type === "universal"){
      preDistance = preDistance * 3
    } else {
      throw new WrongType(`Wrong type, you can choose: standart, lite, universal.`);
    };

    const roundedDistance = preDistance.toFixed();

    const distance = roundedDistance;

    const Status = "Active"

    const doc = new this.orderModel({
      ...body,
      price,
      distance,
      Status,
      id,
    });

    // console.log(findFromInDb)

    const order = await doc.save();

    return order;
  }

  async getFiveLastFrom(body: UserDto) {
    const last5From = [];
    const uniqueFromSet = new Set();
    const FiveLastFromPoints = await this.orderModel.find(
      {login: body.login},
    );

    for (let i = FiveLastFromPoints.length - 1; i >= 0 && uniqueFromSet.size < 5; i--) {
      const currentFrom = FiveLastFromPoints[i].from;
      // console.log(currentTo)
      if (!uniqueFromSet.has(currentFrom)) {
          uniqueFromSet.add(currentFrom);
          console.log(uniqueFromSet)
          last5From.push(FiveLastFromPoints[i]);
      }
  }
    return last5From;
  }

  async getThreeLastToPints(body: UserDto) {

    const last3To = [];
    const uniqueToSet = new Set();
    const ThreeLastToPints = await this.orderModel.find(
      {login: body.login}
    );

    for (let i = ThreeLastToPints.length - 1; i >= 0 && last3To.length < 3; i--) {
        const currentTo = ThreeLastToPints[i].to;
        // console.log(currentTo)
        if (!uniqueToSet.has(currentTo)) {
            uniqueToSet.add(currentTo);
            console.log(uniqueToSet)
            last3To.push(ThreeLastToPints[i]);
        }
    }
    return last3To;
  }

  async getLowesPrice(body: UserDto){

    const findAll = await this.orderModel.find(
      {login: body.login}
    ).sort({ price: 1 }).limit(1);

    if (findAll.length === 0) {
      throw new UserDontHaneAnyOrders(`You have to create new order.`);
    }

    // const sortedDB = findAll


    return findAll
  } 

  async getBiggestPrice(){

    const findAll = await this.orderModel.find(
      {}
    );

    if (findAll.length === 0) {
      throw new UserDontHaneAnyOrders(`You have to create new order.`);
    }

    const Prices = findAll.map(item => item.price);
    // console.log(Prices)

    const sortedPrices = Prices.sort(((a, b) => b - a))
    // console.log(sortedPrices)

    const findBiggest = await this.orderModel.find(
      {price:sortedPrices[0]}
    );
    console.log(findBiggest)
    // const sortedDB = findAll

    return findBiggest
  } 

  async getOrdersForCustomer(body: UserDto){
    const users = await this.orderModel.find(
      {login: body.login}
    );
    return users.map((order) => order.toObject());
  }

  async getOrdersForDriver(){
    const users = await this.orderModel.find(
      {Status: "Active"}
    );
    return users.map((order) => order.toObject());
  }

  async getOrdersForAdmin(){
    const users = await this.orderModel.find(
      {}
    );
    return users.map((order) => order.toObject());
  }

  async updateOrderStatus(param: string, req: UserDto, body: UpdateDto){

    const SearchingInDBByOrderToken = await this.orderModel.findOne(
      {id: param}
    );
    const SearchingForUser = await this.userModel.findOne(
      {login: req.login}
    );

    switch(SearchingForUser.role){

      case "Customer":
        if(SearchingInDBByOrderToken.Status === "Active" && body.Status === "Rejected"){
          SearchingInDBByOrderToken.Status = body.Status
        } else if (SearchingInDBByOrderToken.Status === "Done"){
          throw new WrongStatusForUpdateUserStatus(`As driver, you can't update status with that prompts.`);
        } else if (SearchingInDBByOrderToken.Status !== "Active"){
          throw new WrongStatusForUpdateUserStatus(`As customer, you can't update status, while your curent status is ${SearchingInDBByOrderToken.Status}.`);
        } else if (body.Status !== "Rejected"){
          throw new WrongStatusForUpdateUserStatus(`As customer, you can't update status, while your new status is ${body.Status}.`);
        } 
      break

      case "Driver": 
        if(SearchingInDBByOrderToken.Status === "Active" && body.Status === "In progress" || SearchingInDBByOrderToken.Status === "In progress" && body.Status === "Done"){
          SearchingInDBByOrderToken.Status = body.Status
        } else if (SearchingInDBByOrderToken.Status === "Active"){
          throw new WrongStatusForUpdateUserStatus(`As driver, you can't update status with that prompts.`);
        } else if (SearchingInDBByOrderToken.Status !== "Active" && body.Status !== "In progress" || SearchingInDBByOrderToken.Status !== "In progress" && body.Status !== "Done"){
          throw new WrongStatusForUpdateUserStatus(`As driver, you can't update status with that prompts.`);
        } 
      break

      case "Admin": 
        if(SearchingInDBByOrderToken.Status === "Active" && body.Status === "Rejected" || SearchingInDBByOrderToken.Status === "Active" && body.Status === "In progress" || SearchingInDBByOrderToken.Status === "In progress" && body.Status === "Done"){
          SearchingInDBByOrderToken.Status = body.Status
        } else if (SearchingInDBByOrderToken.Status === "Active"){
          throw new WrongStatusForUpdateUserStatus(`As driver, you can't update status with that prompts.`);
        } else if (SearchingInDBByOrderToken.Status !== "Active" && body.Status !== "In progress" || SearchingInDBByOrderToken.Status !== "In progress" && body.Status !== "Done" || SearchingInDBByOrderToken.Status === "In progress" && body.Status === "Done"){
          throw new WrongStatusForUpdateUserStatus(`As admin, you can't update status with that prompts.`);
        } 
      break

    }

    const updatedOrder = await SearchingInDBByOrderToken.save();
    return updatedOrder
  }

}
