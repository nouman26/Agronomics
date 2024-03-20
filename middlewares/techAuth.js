var jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const Models = require("../models");

const authenticate = async (req, res, next) => {
	// Get token from the header
	const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
   
	// Check if no token
	if (!token) {
		return res.status(401).json({ status: 401, data: 'No authorization token was found' });
	}

	// Verify the token
	let decoded;
	try {
	  	decoded = jwt.verify(token, secret);
	} catch (err) {
		if(err.message == "invalid token"){
			return res.status(401).json({ status: 401, data: 'Invalid token' });
		}
		else if(err.message == "jwt expired"){
			return res.status(401).json({ status: 401, data: 'Token expired' });
		}
	  	else{
			console.log(err)
			return res.status(401).json({ status: 401, data: 'Invalid token' });
		}
	}
   
	if (decoded) {
		let user = await Models.Admin.findOne({
			where: { id: decoded.id}
	   	});

	   	if (!user) {
			return res.status(401).json({ status: 401, data: 'Unauthorized Access' });
		}
		else{
			req.user = decoded;
			return next();
		}
	} else {
	  	return res.status(401).json({ status: 401, data: 'You are not allowed' });
	}
};

module.exports = authenticate;