const cloudinary = require('cloudinary').v2;
import fs from 'fs';
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

class Uploader {

	static async upload() {
		const urls = [];
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET
		});

		// Get a list of files in the "public" directory
		const directoryPath = './images';

		try {
			const files = await fs.promises.readdir(directoryPath);

			// Filter the files with the .png extension
			const pngFiles = files.filter((file) => file.endsWith('.png'));

			// Iterate over the pngFiles array using a for...of loop
			for (const file of pngFiles) {
				const imagePath = `${directoryPath}/${file}`;
				const uuid = uuidv4();

				try {
					// Upload each image to Cloudinary
					const result = await cloudinary.uploader.upload(imagePath, { public_id: uuid });
					console.log(result.secure_url);
					urls.push(result.secure_url);
				}
				catch (error) {
					console.error(`Error uploading image ${file}:`, error);
				}
			}
		}
		catch (error) {
			console.error('Error reading directory:', error);
		}

		console.log(urls);
		return urls;
	}

}

export default Uploader;
