import InstagramService from '../services/instagram';

class Instagram {

	static async publish(req, res) {
		try {
			const result = await InstagramService.publish(req, res);
			if (result.type) {
				console.log('loggedin');
				return res.json({ data: result.data, type: true, message: result.message });
			}
			else {
				return res.json({ type: false, message: result.message });
			}
		}
		catch (error) {
			return res.json({ type: false, error: error });
		}
	}

}

export default Instagram;
