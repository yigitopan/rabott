import ScrapService from '../services/scrap';

class Scrap {

	static async scrap(req, res) {
		try {
			const result = await ScrapService.scrap(req, res);
			if (result.type) {
				return res.json({ data: result.data, type: true, message: result.message });
			}
			else {
				return res.json({ type: false, message: result.message });
			}
		}
		catch (error) {
			return res.json({ type: false, message: error.message });
		}
	}

}

export default Scrap;