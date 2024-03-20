import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js';
import { ORDERS, USERS } from '../db.js';

export const UsersRouter = Router();


UsersRouter.post('/users', (req, res) => {
    const { body } = req;
  
    // console.log(`body`, JSON.stringify(body));
  
    const isUserExist = USERS.some(el => el.login === body.login);
    const user = USERS.find(el => el.login === body.login && el.password === body.password);

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

    const recreateUser = {
        ...body,
        role: "Customer",
    };
      
    //    ORDERS.push(recreateUser);

    // user.role = role;
    // USERS.save(user.login, { role });
  
    // USERS.push(body);
    USERS.push(recreateUser);
    console.log(USERS)
  
    res.status(200).send({ message: 'User was created' });
});

UsersRouter.post('/admin', (req, res) => {

  const { body, headers } = req;

  const isAdminExist = USERS.some(el => el.login === body.login);

  if (isAdminExist) {
    return res.status(400).send({ message: `User with login ${body.login} already exists` })
  };

  headers.SUPER_PASSWORD = "dfdf";
  console.log(headers.SUPER_PASSWORD)

  const recreateAdmin = {
    ...body,
    role: "Admin",
  };
  
  USERS.push(recreateAdmin);

  res.status(200).send({message: 'Admin was created' });

});

UsersRouter.post('/drivers', (req, res) => {

  const { body } = req;

  const isdriverExist = USERS.some(el => el.login === body.login);

  if (isdriverExist) {
    return res.status(400).send({ message: `User with login ${body.login} already exists` })
  };

  const recreateDriver = {
    ...body,
    role: "Driver",
  };
  
  USERS.push(recreateDriver);

  res.status(200).send({message: 'Driver was created' });

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

    user.token = token;
    USERS.save(user.login, { token});
  
    return res.status(200).send({
      token,
      role,
      message: 'User was login'
    });
});

