import express from 'express';
import ScrapController from '../controllers/scrap';
const app = express();

app.get('/rewe', ScrapController.rewe);
app.get('/lidl', ScrapController.lidl);

export default app;