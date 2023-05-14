import express from 'express';
import InstagramController from '../controllers/instagram';

const app = express();

app.post('/publish', InstagramController.publish);

export default app;