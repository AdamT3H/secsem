import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ORDERS, ADDRESS} from '../db.js';

export const OrdersRouter = Router();



const convertToDate = (date) => {

 /***
  * ^ -- початок рядка
  * \d -- перевірка на цифру
  * {N} -- N - разів повторень
  */
 // if (/^\d\d-(01|02|03|....|10|11|12)-\d{4}$/.test(query.createdAt)) { }
 if (!/^\d\d-\d\d-\d{4}$/.test(date)) {
  // return res.status(400).send({ message: `parameter createdAt has wrong format` });
  throw new Error(`parameter createdAt has wrong format`);
 }

 // const res = query.createdAt.split('-');
 // const month = res[1];
 const [day, month, year] = date.split('-');

 const mothsInt = parseInt(month);
 if (mothsInt < 1 || mothsInt > 12) {
  // return res.status(400).send({ message: `parameter createdAt has wrong month value` });

  throw new Error(`parameter createdAt has wrong month value`);
 }

 const result = new Date();
 result.setHours(2);
 result.setMinutes(0);
 result.setMilliseconds(0);
 result.setSeconds(0);

 result.setMonth(mothsInt - 1);
 result.setDate(day);
 result.setFullYear(year);

 return result;
};

const convertToDateMiddleware = (fieldName) => (req, res, next) => {
 const valueString = req.query[fieldName];

 if (!valueString) {
  return next();
 }
 try {
  const value = convertToDate(valueString);
  req.query[fieldName] = value;
  return next();
 } catch (err) {
  return res.status(400)
   .send({ message: err.toString() });
 }
};

OrdersRouter.post('/orders', authorizationMiddleware, (req, res) => {
 const { body, user } = req;

 const createdAt = new Date();
 createdAt.setHours(2);
 createdAt.setMinutes(0);
 createdAt.setMilliseconds(0);
 createdAt.setSeconds(0);

 const bodyToAddress = body.to;
 const bodyFromAddress = body.from;
 const FindToAddressInBd = ADDRESS.find(({name}) => name === bodyToAddress);
 console.log(FindToAddressInBd)
 const FindFromAddressInBd = ADDRESS.find(({name}) => name === bodyFromAddress);

 if (!FindToAddressInBd || !FindFromAddressInBd){
  return res.status(400).send({ message: "This address does not exist"});
 };
 
 function convertDegreestoRadians(coords){  // треба для того, щоб джава коректно обраховувала math. функції (формулу найшов в інеті, коментарі писав не JPT а я для себе)
  return coords * Math.PI / 180;
 };

 function distanceBetweenCoords(latitude1, longitude1, latitude2, longitude2){

  const latitudeInRadians1 = convertDegreestoRadians(latitude1);
  const latitudeInRadians2 = convertDegreestoRadians(latitude2);

  const earthRadius = 6371;

  const diferanceLatitude = convertDegreestoRadians(latitude2 - latitude1);
  const diferancelongitude = convertDegreestoRadians(longitude2 - longitude1);

  const underRoot = Math.sin(diferanceLatitude / 2) * Math.sin(diferanceLatitude / 2) + Math.cos(latitudeInRadians1) * Math.cos(latitudeInRadians2) * Math.sin(diferancelongitude / 2) * Math.sin(diferancelongitude / 2);
  const inRoot = 2 * Math.asin(Math.sqrt(underRoot));

  return earthRadius * inRoot;

 };

 const latitude1 = FindToAddressInBd.location.latitude;
 const longitude1 = FindToAddressInBd.location.longitude;
 const latitude2 = FindFromAddressInBd.location.latitude;
 const longitude2 = FindFromAddressInBd.location.longitude;

 const distance = distanceBetweenCoords(latitude1, longitude1, latitude2, longitude2);
 const roundedDistance = distance.toFixed();

 const order = {
  ...body,
  login: user.login,
  createdAt,
  status: "Active",
  id: crypto.randomUUID(),
  distance: roundedDistance + ' Km',
  price: " "
 };


 switch(body.type){

  case "standart":

    order.price = roundedDistance * 2.5;

    console.log("You have to pay an extra 2.5 distance for standart");

    res.status(200).send({ message: "You have to pay an extra 2.5 distance for standart", order });

  break;

  case "lite":

    order.price = roundedDistance * 1.5;

    console.log("You have to pay an extra 1.5 distance for lite");

    res.status(200).send({ message: "You have to pay an extra 1.5 distance for lite", order });

  break;

  case "universal":

    order.price = roundedDistance * 3;

    console.log("You have to pay an extra 3 distance for universal");

    res.status(200).send({ message: "You have to pay an extra 3 distance for universal", order });

  break;

  default:
    res.status(400).send({ message: "Sorry, we cant find this option, you can only chose betwen: standart, lite, universal."});
}

 ORDERS.push(order);
});


/**
* GET /orders?createdAt=05-05-2024
* GET /orders?createdAt= g mhdfbg kjdfbgkjd
*/
OrdersRouter.get('/orders', authorizationMiddleware, convertToDateMiddleware('createdAt'), convertToDateMiddleware('createdFrom'), convertToDateMiddleware('createdTo'), (req, res) => {
  const { user, query} = req;
  console.log("поіертвє юзера по токену",user)

  if (query.createdAt && query.createdFrom && query.createdTo) {
   return res.status(400).send({ message: "Too many parameter in query string" });
  }

  console.log(`query`, JSON.stringify(query));

  let orders = ORDERS.filter(el => el.login === user.login);
  let ordersActive = ORDERS.filter(el => el.status === "Active");

  if (query.createdAt) {

   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() === query.createdAt.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdFrom) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() >= query.createdFrom.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdTo) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() <= query.createdTo.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  console.log(user.role)

  switch(user.role){

    case "Customer":

      return res.status(200).send(orders);

    case "Admin":

      return res.status(200).send(ORDERS);

    case "Driver":

      return res.status(200).send(ordersActive);

  }

});



/**
 * PATCH /orders/fhsdjkhfkdsj
 * PATCH /orders/fhsdjkhfkdsj12
 * PATCH /orders/fhsdjkhfkdsj123
 * PATCH /orders/fhsdjkhfkd123sj
 */

OrdersRouter.patch('/orders/:orderId', authorizationMiddleware, (req, res) => {

  const { user, params, body} = req;
  console.log("поіертвє юзера по токену", user)

 let order = ORDERS.find(el => el.id === params.orderId);

 if (!order) {
  return res.status(400).send({ message: `Order with id ${params.orderId} was not found` });
 }

 if (user.role === "Customer"){

    if (order.status === "Active" && body.status === "Rejected"){

      ORDERS.update((el) => el.id === params.orderId, { status: body.status });

    }
 };

 if (user.role === "Driver"){

  if (order.status === "Active" && body.status === "In progress"){

    ORDERS.update((el) => el.id === params.orderId, { status: body.status });

  };

  if (order.status === "In progress" && body.status === "Done"){

    ORDERS.update((el) => el.id === params.orderId, { status: body.status });

  }
 };

 if (user.role === "Admin"){

  if (order.status === "Active" && body.status === "Rejected"){

    ORDERS.update((el) => el.id === params.orderId, { status: body.status });

  }

  if (order.status === "Active" && body.status === "In progress"){

    ORDERS.update((el) => el.id === params.orderId, { status: body.status });

  }

  if (order.status === "In progress" && body.status === "Done"){

    ORDERS.update((el) => el.id === params.orderId, { status: body.status });

  }
};


 order = ORDERS.find(el => el.id === params.orderId);
 return res.status(200).send(order);
});