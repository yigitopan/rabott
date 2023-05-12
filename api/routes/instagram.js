import express from 'express';
import InstagramController from '../controllers/instagram';
import Auth from '../helpers/auth';

const app = express();

app.post('/publish', Auth.authentication, InstagramController.publish);

export default app;