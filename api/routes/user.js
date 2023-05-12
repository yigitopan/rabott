import express from 'express';
import UserController from '../controllers/user';
import Auth from '../helpers/auth';

const app = express();

app.post('/login', UserController.login);
app.post('/add', Auth.authentication, UserController.addUser);

export default app;