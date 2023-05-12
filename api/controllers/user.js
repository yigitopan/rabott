import UserService from '../services/user';

class User {

	static async login(req, res) {
		try {
			const result = await UserService.login(req, res);
			if (result.type) {
				console.log('loggedin');
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

	static async addUser(req, res) {
		try {
			const result = await UserService.addUser(req, res);
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

export default User;
