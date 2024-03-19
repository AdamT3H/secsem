import express from 'express';
import bodyParser from 'body-parser';
import { USERS } from './db.js';
import { OrdersRouter, UsersRouter} from './routers/index.js';

const app = express();

app.use(bodyParser.json());

app.use(OrdersRouter);

app.use(UsersRouter);




app.listen(8080, () => console.log('Server was started'));