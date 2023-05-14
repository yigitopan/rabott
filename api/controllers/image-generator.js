import ImageGeneratorService from '../services/image-generator';
import Discount from '../src/models/discount';
import Uploader from '../helpers/image-uploader';
import Promise  from 'promise';
import InstagramPoster from '../helpers/instagram';

class ImageGenerator {

	static async generate(req, res) {
		try {
			const discount = await Discount.findOne().sort({ _id: -1 }).limit(1);
			const promises = discount.discountItems.map((di, i) =>
				ImageGeneratorService.generate(discount, i)
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
