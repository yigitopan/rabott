import jwt from 'jsonwebtoken';
import User from '../src/models/user';

class Auth {

	static async authentication(req, res, next) {
		const sessionToken = req.session.token;
		if (!sessionToken) {
			return res.status(401).json({ message: 'Unauthorized access' });
		}
        
		try {
			const decodedToken = jwt.verify(sessionToken, 'gozgozgoztepe');
			req.userId = decodedToken.userId;

			const user = await User.findOne({ _id: req.userId });
            
			if (user) {
				next();
			}

			else {
				return res.status(401).json({ type: false, message: 'Unauthorized' });
			}

		}
		catch (error) {
			return res.status(500).json({ type: false, message: 'Invalid Token' });
		}
	}

}

export default Auth;