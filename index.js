import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dbConnect from './api/src/config/config.js';
/*
 * import userRoutes from './api/routes/user.js';
 * import postRoutes from './api/routes/post.js';
 */

import swaggerOptions from './api/src/config/swagger-options.js';
import swaggerJsdoc  from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import userRoutes from './api/routes/user.js';
import instaRoutes from './api/routes/instagram.js';
import scrapRoutes from './api/routes/scrap.js';
import imageGeneratorRoutes from './api/routes/image-generator.js';

const app = express();

require('dotenv').config();

app.use(bodyParser.json());
 
app.use(cors());

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(session({
	secret: 'gozgozgoztepe',
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 1200000}
}));

dbConnect()
	.then(() => {
		app.listen(process.env.PORT || 5000);
		console.log('Server is running');
	})
	.catch(err => {
		console.log(err);
		throw new Error('Couldn\'t connect to the database');
	});
	
app.use(express.static('public'));

app.use('/user', userRoutes);
app.use('/instagram', instaRoutes);
app.use('/scrap', scrapRoutes);
app.use('/image-generator', imageGeneratorRoutes);

app.listen(process.env.PORT || 3000);

module.exports = app;
