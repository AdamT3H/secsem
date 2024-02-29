import express from 'express';
import bodyParser from 'body-parser';
import { USERS, ORDERS } from './db.js';
import { authorizationMiddleware } from './middlewares.js';
import { v4 as uuidv4 } from 'uuid';



const app = express();

app.use(bodyParser.json());

const orderArrey = [];

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */
app.post('/users', (req, res) => {
 const { body } = req;

 console.log(`body`, JSON.stringify(body));

 const isUserExist = USERS.some(el => el.login === body.login);
 if (isUserExist) {
  return res.status(400).send({ message: `user with login ${body.login} already exists` });
 }

 USERS.push(body);

 res.status(200).send({ message: 'User was created' });
});

app.get('/users', (req, res) => {
 const users = USERS.map(user => {
  const { password, ...other } = user;
  return other;
 });
 return res
  .status(200)
  .send(users);
});

app.post('/login', (req, res) => {
 const { body } = req;

 const user = USERS
  .find(el => el.login === body.login && el.password === body.password);

 if (!user) {
  return res.status(400).send({ message: 'User was not found' });
 }

 const token = crypto.randomUUID();

 user.token = token;
 USERS.save(user.login, { token });

 return res.status(200).send({
  token,
  message: 'User was login'
 });
});

app.post('/orders', authorizationMiddleware, (req, res) => {

 const { body, user } = req;

 function getRandomArbitrary() {

  return Math.floor(Math.random() * (101 - 20)) + 20;

 };

 const order = {
  ...body,
  login: user.login,
  Price: getRandomArbitrary()
 };

 console.log(order);

 ORDERS.push(order);

 orderArrey.push(order);

 console.log(orderArrey);

 return res.status(200).send({ message: 'Order was created', order });
});

app.get('/orders', authorizationMiddleware, (req, res) => {
 const { user } = req;

 const orders = ORDERS.filter(el => el.login === user.login);

 return res.status(200).send(orders);
});

app.get('/orders/from', authorizationMiddleware, (req, res) => {

  const { user } = req;

  const curentUser = ORDERS.filter(el => el.login === user.login);

  const lastFiveUser = curentUser.slice(-5);

  const fromValues = lastFiveUser.map(item => item.from);

  return res.status(200).send( {message: 'Last 5 froms', fromValues});
});

app.get('/orders/to', authorizationMiddleware, (req, res) => {

  const { user } = req;

  let uniqueList = [];

  const curentUser = ORDERS.filter(el => el.login === user.login);

  for (let i = curentUser.length - 1; i >= 0; i--) {

    if (uniqueList.length === 3) break;

    const toAddress = curentUser[i].to;

    if (!uniqueList.includes(toAddress)) {

      uniqueList.push(toAddress);
      
    }
  };

  return res.status(200).send( {message: 'Last 3 unique to orders', uniqueList});

});

app.get('/orders/lowestPrice', authorizationMiddleware, (req, res)  => {

  const { user } = req;

  const curentUser = ORDERS.filter(el => el.login === user.login);

  const Prices = curentUser.map(item => item.Price);

  const sortedPrices = Prices.sort((a, b) => a - b);

  const lowestPrice = sortedPrices[0];

  const LowestUserByPrice = ORDERS.find(el => el.Price === lowestPrice);

  if(Prices.length === 0){

    return res.status(400).send({ message: 'User has no orders yet' });

  }

  return res.status(200).send( {message: 'Here is the Order with lowest Price: ', LowestUserByPrice});

})

app.get('/orders/BigestPrice', authorizationMiddleware, (req, res)  => {

  const { user } = req;

  const curentUser = ORDERS.filter(el => el.login === user.login);

  const Prices = curentUser.map(item => item.Price);

  const sortedPrices = Prices.sort((a, b) => a - b);

  const BigestPrice = sortedPrices[sortedPrices.length - 1];


  const BigestUserByPrice = ORDERS.find(el => el.Price === BigestPrice);

  if(Prices.length === 0){

    return res.status(400).send({ message: 'User has no orders yet' });

  }

  return res.status(200).send( {message: 'Here is the Order with Bigest Price): ', BigestUserByPrice});

})



app.listen(8080, () => console.log('Server was started'));