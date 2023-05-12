import User from '../src/models/user'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {

	static async addUser(req, res) {
		try {
		  const { username, password } = req.body;
	  
		  // Hash the password
		  const hashedPassword = await bcrypt.hash(password, 10);
	  
		  // Create a new user record in the database
		  try {
				const user = new User({
					username: username,
					password: hashedPassword
				});
				await user.save();
                
				return { type: true, data: user, message: 'User signed up successfully' };
		  }
			catch (error) {
				throw error;
			}
	  
		}
		catch (error) {
		  console.error(error);
		  res.status(500).send({ error: 'Unable to create user' });
		}
	  }

	static async login(req, res) {
		const { username, password } = req.body;

		try {
			const user = await User.findOne({ username: username });
			const isValidPass = await bcrypt.compare(password, user.password);

			if (!user || !isValidPass) {
				res.status(401);
				return ({ error: 'Invalid email or password' });
			}

			const token = jwt.sign({ userId: user.id }, 'gozgozgoztepe');
			req.session.token = token;

			res.status(200);
			return { type: true, data: {token, user}, message: 'User logged in successfully' };
		}
		catch (err) {
			throw err;
		}
	}

}

export default UserService;
