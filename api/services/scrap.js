/* eslint-disable no-undef */
import puppeteer from 'puppeteer';
import Discount from '../src/models/discount';

class ScrapService {

	static async autoScroll(page) {
		await page.evaluate(async () => {
		  await new Promise((resolve) => {
				const scrollHeight = document.documentElement.scrollHeight;
				let scrollTop = 0;
				const distance = 100;
				const scrollDelay = 100;
	  
				const timer = setInterval(() => {
			  window.scrollBy(0, distance);
			  scrollTop += distance;
	  
			  if (scrollTop >= scrollHeight) {
						clearInterval(timer);
						resolve();
			  }
				}, scrollDelay);
		  });
		});
	  }
	  
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

		const wrappers = await page.$$('.cor-offer-renderer-tile.cor-link'); // Get all the wrapper elements

		const discountItems = [];

		for (const wrapper of wrappers) {
			const image = await wrapper.$eval('.cor-offer-image img', (node) => node.getAttribute('src'));
			const title = await wrapper.$eval('.cor-offer-information .cor-offer-information__title a.cor-offer-information__title-link', (node) => node.textContent.trim());
			const price = await wrapper.$eval('.cor-offer-price__tag-price', (node) => node.textContent.trim());

			const descriptionElements = await wrapper.$$('.cor-offer-information .cor-offer-information__additional');
			let description = '';
			for (const element of descriptionElements) {
				const text = await element.evaluate((node) => node.textContent.trim());
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
			return { type: true, data: discountItems, message: 'Discounts saved in DB' };		
		}
		else {
			res.status(400);
			return { type: false, data: {}, message: 'Discount already available' };
		}

	}

	static async lidl(req, res) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36');

		await page.goto('https://www.lidl.de/c/billiger-montag/a10006065?channel=store&tabCode=Current_Sales_Week', { waitUntil: 'networkidle0' });

		await this.autoScroll(page);
		const wrappers = await page.$$('.ACampaignGrid__item--product'); // Get all the wrapper elements

		const discountItems = [];
 
		for (const wrapper of wrappers) {
			let title;
			let image;
			let price;
			let desc;
			let error = false;
			let hasDesc = false;
			try {
				title = await wrapper.$eval('.grid-box__headline.grid-box__text--dense', (node) => node.textContent.trim());
				image = await wrapper.$eval('.product-grid-box__image.default-image', (node) => node.getAttribute('src'));
				price = await wrapper.$eval('.m-price__price.m-price__price--small', (node) => node.textContent.trim());
				try {
					const description = await wrapper.$('.product-grid-box__desc');
					desc = await description.evaluate((node) => node.textContent.trim());
					hasDesc = true;		
				}
				catch (err) {
					//hasdesc remains false
				}
			}
			catch (err) {
				error = true;
			}
			
			if (!error) {
				const discountItem = {
					supermarket: 'lidl',
					period: '',
					description: '',
					product: title,
					img_url: image,
					price: price+' €',
					posted: false
				};

				if (hasDesc) {
					discountItem.description = desc;
				}
				discountItems.push(discountItem);
			}

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
			return { type: true, data: discountItems, message: 'Discounts saved in DB' };		
		} 
		else {
			res.status(400);
			return { type: false, data: discountItems, message: 'Discount already available' };
		}

	}

}

export default ScrapService;
