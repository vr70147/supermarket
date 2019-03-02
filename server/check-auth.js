const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify( token, process.env.JWT_KEY, (err, decoded) => {
            if( err ) {
                return res.status(500).send({
                    auth: false,
                    massage: 'Authorizion token failed'
                });
            }
            req.decoded = decoded;
            console.log(req.decoded);
        } );
        next();
    } catch {
        res.status( 401 ).json( {
            massage: 'Auth Failed'
        });
    };
};