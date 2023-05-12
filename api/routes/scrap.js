import express from 'express';
import ScrapController from '../controllers/scrap';
const app = express();

app.get('/scrap', ScrapController.scrap);

export default app;