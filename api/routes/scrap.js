import express from 'express';
import ScrapController from '../controllers/scrap';
const app = express();

app.get('/rewe', ScrapController.rewe);
app.get('/lidl', ScrapController.lidl);
app.get('/edeka', ScrapController.edeka);
app.get('/clear', ScrapController.clear);

export default app;