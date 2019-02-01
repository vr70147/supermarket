const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify( token, 'secret_this_is_should_be_longer', (err, decoded) => {
            if( err ) {
                return res.status(500).send({
                    auth: false,
                    massage: 'Authorizion token failed'
                });
            }
            req.decoded = decoded;
        } );
        next();
    } catch {
        res.status( 401 ).json( {
            massage: 'Auth Failed'
        });
    };
};