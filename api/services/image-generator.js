import puppeteer from 'puppeteer';
import supermarketLogos from '../../supermarkets/logos';

class ImageGeneratorService {

	static generateHTML(discount, i) {

		const supermarketLogo = supermarketLogos.rewe;
		const discountItem = discount.discountItems[i];
		const hasDescription = true;
	  
		return `
		<!DOCTYPE html>
		<html>
		<head>
		  <style>
		  @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
			html, body { 
			  font-family: 'Montserrat', sans-serif;
			  margin: 0;
			  padding: 0;
			  width: 1170px;
			  height: 1170px;
			  background:black;
			}
			.discount-wrapper {
			  padding:20px;
			  position: relative;
			  width: 100%;
			  height: 100%;
			  display: flex;
			  flex-direction: column;
			  align-items: center;
			  justify-content: center;
			}
			.discount-img {
			  width: 400px;
			  height: 400px;
			  background-image: url('${discountItem.img_url}');
			  background-size: cover;
			  background-position: center;
			  margin-bottom: 20px;
			}
			.discount-title {
			  color:white;
			  font-size:38px;
			  text-align: center;
			  font-weight: bold;
			  margin-bottom: 20px;
			}
			.discount-description {
				color:white;
			  font-size:30px;
			  text-align: center;
			  margin-bottom: 20px;
			}
			.discount-price {
			  font-size:46px;
			  color:#45fe5e;
			  font-weight: bold;
			  text-align: center;
			}
			.supermarket-logo {
			  position: absolute;
			  left:20px;
			  top: 20px;
			  width: 300px;
			  height:300px;
			  background-image: url('${supermarketLogo}');
			  background-size: contain;
			  background-repeat: no-repeat;
			}

			.period {
				color:white;
				font-weight: bold;
				font-size:24px;
				position: absolute;
				right:20px;
				top: 20px;
				width:300px;
			  }
		  </style>
		</head>
		<body>
		  <div class="discount-wrapper">
			<div class="supermarket-logo"></div>
			<div class="discount-img"></div>
			<div class="period">${discount.period}</div>
			<p class="discount-title">${discountItem.product}</p>
			${hasDescription ? `<p class="discount-description">${discountItem.description}</p>` : ''}
			<p class="discount-price">${discountItem.price}</p>
		  </div>
		</body>
		</html>
	  `;
	}
	   
	static async generate(discount, index) {
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
		  
			await page.setViewport({ width: 1200, height: 1200 });
		  
			  await page.goto('about:blank');
			  await page.setContent(this.generateHTML(discount, index),  { waitUntil: 'networkidle0' });
			// Take a screenshot of the page
			await page.screenshot({ path: `images/${index}.png` });
		  
			// Close the browser
			await browser.close();

			return { type: true, data: 5, message: 'Screenshot taken' };
		}
		catch (err) {
			throw err;
		}
	}

}

export default ImageGeneratorService;
