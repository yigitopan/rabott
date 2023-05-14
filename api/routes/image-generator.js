import express from 'express';
import ImageGeneratorController from '../controllers/image-generator';

const app = express();

app.post('/generate', ImageGeneratorController.generate);

export default app;