/* eslint-disable max-len */
import axios from 'axios';

require('dotenv').config();

class InstagramPoster {

	static async publish(urls) {

		const containerIDs = [];

		// Read the image file

		try {
			for (let index = 0;index < urls.length;index++) {
				
				let data = JSON.stringify({
			  image_url: urls[index],
			  is_carousel_item: true,
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
		  
				const response = await axios.request(config);

				containerIDs.push(response.data.id);
			}

			/////////////////////
			let cData = JSON.stringify({
				caption: 'Das ist mein das allererste automatisierte Carousel-Post mit Caption!',
				media_type: 'CAROUSEL',
				children: containerIDs,
				access_token: process.env.INSTA_TOKEN
			  });
			
			  let cConfig = {
				method: 'post',
				maxBodyLength: Infinity,
				url: process.env.INSTA_CREATE_CAROUSEL_URL,
				headers: {
					  'Content-Type': 'application/json'
				},
				data: cData
			  };
			
			  const cResponse = await axios.request(cConfig);
  
			////////////////////
			
			let data_container = JSON.stringify({
			  creation_id: cResponse.data.id,
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
		  
			await axios.request(config_container);
		  
			return { type: true, message: 'Posted successfully' };
		  }
		catch (error) {
			console.error(error);
			return { type: false, message: 'Error' };
		  }
		  
	  }

}

export default InstagramPoster;
