const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify( token, 'secret_this_is_should_be_longer' );
        next();
    } catch {
        res.status( 401 ).json( {
            massage: 'Auth Failed'
        });
    };
};