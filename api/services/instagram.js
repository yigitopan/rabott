/* eslint-disable max-len */
import axios from 'axios';
import fs from 'fs';
let path = require('path');

require('dotenv').config();

class InstagramService {

	static async publish(req, res) {
		// Read the image file
		let jsonPath = path.join(__dirname, '..', '..', 'lorem.png');

		console.log(__dirname);
		const imageData = fs.readFileSync(jsonPath);

		// Convert image data to base64
		// eslint-disable-next-line no-unused-vars
		const base64Image = Buffer.from(imageData).toString('base64');

		try {
			let data = JSON.stringify({
				image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Lorem_Ipsum.png',
				caption: '',
				access_token: process.env.INSTA_TOKEN
			});
              
			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				url: process.env.INSTA_CREATE_CONTAINER_URL,
				headers: { 
					'Content-Type': 'application/json'
				},
				data: data
			};
              
			axios.request(config)
				.then((response) => {
					let data_container = JSON.stringify({
						creation_id: response.data.id,
						access_token: process.env.INSTA_TOKEN
					});

					let config_container = {
						method: 'post',
						maxBodyLength: Infinity,
						url: process.env.INSTA_PUBLISH_URL,
						headers: { 
							'Content-Type': 'application/json'
						},
						data: data_container
					};

					axios.request(config_container)
						.then(() => {
							
						})
						.catch((error) => {
							console.log(error);
						});

				})
				.catch((error) => {
					console.log(error);
				});
		  
			res.status(200);
			return { type: true, message: 'Posted successfully' };
	  
		}
		catch (error) {
		  console.error(error);
		  res.status(500).send({ error: 'Unable to create user' });
		}
	  }

}

export default InstagramService;

