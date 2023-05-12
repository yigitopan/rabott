import puppeteer from 'puppeteer';

class ScrapService {

	static async scrap(req, res) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36');

		await page.goto('https://www.rewe.de/angebote/nationale-angebote/', { waitUntil: 'networkidle0' });

		const images = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-image img'); //img element, i want to save its src
		const titles = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-information .cor-offer-information__title a.cor-offer-information__title-link'); //we did it, it was a text inside a
		const descriptions = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__content .cor-offer-information .cor-offer-information'); // i recently asked about this. each '.cor-offer-information' has multiple span elements and we want to concat 
		const prices = await page.$$('#sos-category__grid-topangebote .cor-offer-renderer-tile__footer .cor-offer-price__tag-price'); //just a div with text inside

		const offers = [];

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
				description += text + ', ';
			}
			
			description = description.slice(0, -2); // Remove the trailing comma and space

			const discountObject = {
				image_url: image,
				title,
				description,
				price
			};

			offers.push(discountObject);
		}

		console.log(offers);

		await browser.close();

		await browser.close();
		  
		res.status(200);
		return { type: true, data: offers, message: 'User signed up successfully' };
	  }

}

export default ScrapService;
