const jwt = require('jsonwebtoken');

const auth = async (request, response, next) => {
	try {
		const token = request.header('Authorization').replace('Bearer ', '');
		if (!token)
			throw new Error('Invalid token');
		
		const decoded = jwt.verify(token, 'animalitos');

		request.token = token;
		request.decoded = decoded;

		next();
	} catch (error) {
		console.log(error)
		response.status(401).send({ error: 'User not authenticated' });
	}
}

module.exports = auth;