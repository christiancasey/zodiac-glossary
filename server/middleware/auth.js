const jwt = require('jsonwebtoken');

const auth = async (request, response, next) => {
	try {
		const token = request.header('Authorization') ? request.header('Authorization').replace('Bearer', '').trim() : '';
		
		request.token = '';
		request.decoded = '';

		// if (!token) {
		// 	// throw new Error('Invalid token');
		// }
		
		if (token) {
			const decoded = jwt.verify(token, 'animalitos');

			request.token = token;
			request.decoded = decoded;
		}

		next();

	} catch (error) {
		console.log(error);
		console.log('\n\nERROR IN auth()\n\n');
		response.status(401).send({ error: 'User not authenticated' });
	}
}

module.exports = auth;