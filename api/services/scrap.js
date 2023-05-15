import puppeteer from 'puppeteer';
import Discount from '../src/models/discount';

class ScrapService {

	static async isDiscountExists(product, period) {
		const existingDiscount = await Discount.findOne({ product, period });
		return existingDiscount !== null;
	  }

	static formatDate(date) {
		let day = date.getDate();
		let month = date.getMonth() + 1; // January is 0
		let year = date.getFullYear();
	  
		// Add leading zeros if necessary
		day = day < 10 ? `0${day}` : day;
		month = month < 10 ? `0${month}` : month;
	  
		return `${day}.${month}.${year}`;
	  }

	static async rewe(req, res) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36');

		await page.goto('https://www.rewe.de/angebote/nationale-angebote/', { waitUntil: 'networkidle0' });

		const images = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-image img'); //img element, i want to save its src
		const titles = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-information .cor-offer-information__title a.cor-offer-information__title-link'); //we did it, it was a text inside a
		const descriptions = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-information'); // i recently asked about this. each '.cor-offer-information' has multiple span elements and we want to concat 
		const prices = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__footer .cor-offer-price__tag-price'); //just a div with text inside

		const discountItems = [];

		for (let i = 0;i < images.length;i++) {
			const image = await images[i].evaluate(node => node.getAttribute('src'));
			const title = await titles[i].evaluate(node => node.textContent.trim());
			const price = await prices[i].evaluate(node => node.textContent.trim());
  
			const descriptionElement = descriptions[i];
			const additionalElements = await descriptionElement.$$('.cor-offer-information__additional');
			let description = '';
			for (let j = 0;j < additionalElements.length;j++) {
				const additionalElement = additionalElements[j];
				const text = await additionalElement.evaluate(node => node.textContent.trim());
				description += text; 
			}

			const discountItem = {
				supermarket: 'rewe',
				period: '',
				product: title,
				description: description,
				img_url: image,
				price: price,
				posted: false
			  };

			  discountItems.push(discountItem);
		}
	
		let dt = new Date(); // current date of week
		let currentWeekDay = dt.getDay();
		let lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
		let wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
		let wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
	
		let formattedStartDate = this.formatDate(wkStart); // Format start date
		let formattedEndDate = this.formatDate(wkEnd); // Format end date
	
		let validityString = `Gültig ab ${formattedStartDate} bis ${formattedEndDate}`;

		discountItems.forEach(async di => {
			
			const discount = new Discount({
				supermarket: di.supermarket,
				period: validityString,
				product: di.product,
				description: di.description,
				img_url: di.img_url,
				price: di.price,
				posted: di.posted
			  });

			  const exists = await this.isDiscountExists(discount.product, discount.period);

			  if (!exists) {
				await discount.save();
			  }

		});

		await browser.close();
		const exists = false;

		if (!exists) {
			res.status(200);
			return { type: true, data: 5, message: 'Discounts saved in DB' };		
		}
		else {
			res.status(400);
			return { type: false, data: {}, message: 'Discount already available' };
		}

	  }

}

export default ScrapService;
