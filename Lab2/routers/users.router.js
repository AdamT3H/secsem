import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ORDERS, USERS } from '../db.js';

export const UsersRouter = Router();


UsersRouter.post('/users', (req, res) => {
    const { body } = req;
  
    // console.log(`body`, JSON.stringify(body));
  
    const isUserExist = USERS.some(el => el.login === body.login);
    // const user = USERS.find(el => el.login === body.login && el.password === body.password);

    // const userRole = "Customer";
  
    // user.role = userRole;
    // USERS.save({ userRole });
    // console.log(USERS)

    // console.log(user)
    if (isUserExist) {
      return res.status(400).send({ message: `user with login ${body.login} already exists` });
    }

    // const userRole = "Customer";
  
    // USERS.role({ userRole });

    // console.log(USERS)

    // const recreateUser = {
    //     ...body,
    //     role: "Customer",
    // };
      
    //    ORDERS.push(recreateUser);
  
    USERS.push(body);
    // USERS.push(recreateUser);
    console.log(USERS)
  
    res.status(200).send({ message: 'User was created' });
});

UsersRouter.get('/users', (req, res) => {
    const users = USERS.map(user => {
      const { password, ...other } = user;
      return other;
    });
    return res
      .status(200)
      .send(users);
});
    
UsersRouter.post('/login', (req, res) => {
    const { body } = req;
  
    const user = USERS.find(el => el.login === body.login && el.password === body.password);
  
    if (!user) {
      return res.status(400).send({ message: 'User was not found' });
    }
  
    const token = crypto.randomUUID();

    const role = "Customer"

    user.role = role;
    user.token = token;
    USERS.save(user.login, { token, role });
  
    return res.status(200).send({
      token,
      role,
      message: 'User was login'
    });
});

UsersRouter.post('/admin', (req, res) => {
    const { body } = req;
  

  
    return res.status(200).send();
});

