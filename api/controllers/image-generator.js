import ImageGeneratorService from '../services/image-generator';
import Discount from '../src/models/discount';
import Uploader from '../helpers/image-uploader';
import Promise  from 'promise';
import InstagramPoster from '../helpers/instagram';
import fs from 'node:fs/promises';
import path from 'node:path';

class ImageGenerator {

	static async generate(req, res) {
		const directory = 'images/';

		for (const file of await fs.readdir(directory)) {
			await fs.unlink(path.join(directory, file));
		}

		try {
			const lastDiscount = await Discount.findOne({ posted: false }).sort({ _id: -1 }).limit(1);
			const lastSupermarket = lastDiscount.supermarket;
			const discounts = await Discount.find({ posted: false, supermarket: lastSupermarket }).limit(10);
			
			  const promises = discounts.map((di, i) =>
			  ImageGeneratorService.generate(di, i)
			  );
			  
			  const results = await Promise.all(promises);
			  
			  let hasError = false;
			  for (const result of results) {
			  if (!result.type) {
			  hasError = true;
			  break;
			  }
			  }
			  
			  if (hasError) {
			  return res.json({ type: false, message: 'Error generating images' });
			  }
			  
			  const urls = await Uploader.upload();
			  // eslint-disable-next-line no-unused-vars
			  const end  = await InstagramPoster.publish(urls);
			res.status(200);
			return res.json({ data: results.length, type: true, message: 'Images generated and uploaded' });
		}
		catch (error) {
			return res.json({ type: false, message: error.message });
		}
	}

}

export default ImageGenerator;
