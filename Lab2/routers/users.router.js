import { Router } from 'express';
import { USERS } from '../db.js';

export const UsersRouter = Router();


UsersRouter.post('/users', (req, res) => {
    const { body } = req;
  
    const isUserExist = USERS.some(el => el.login === body.login);

    if (isUserExist) {
      return res.status(400).send({ message: `user with login ${body.login} already exists` });
    }

    const recreateUser = {
        ...body,
        role: "Customer",
    };
      
    USERS.push(recreateUser);
    console.log(USERS)
  
    res.status(200).send({ message: 'User was created' });
});

UsersRouter.post('/admin', (req, res) => {

  const { body } = req;

  const isAdminExist = USERS.some(el => el.login === body.login);

  if (isAdminExist) {
    return res.status(400).send({ message: `User with login ${body.login} already exists` })
  };

  const SUPER_PASSWORD = "123456789000";
  console.log(SUPER_PASSWORD)

  const recreateAdmin = {
    ...body,
    role: "Admin",
  };
  
  USERS.push(recreateAdmin);

  res.status(200).send({message: 'Admin was created', token: SUPER_PASSWORD});

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