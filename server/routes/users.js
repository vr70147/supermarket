const express = require('express');
const User = require('../model/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', ( req, res, next ) => {
    bcrypt.hash( req.body.password, 10)
    .then( hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            city: req.body.city,
            street: req.body.street,
            fname: req.body.fname,
            lname: req.body.lname,
            role: req.body.role
        });
        user.save()
        .then( result => {
            res.status(201).json({
                massage: 'נרשמת בהצלחה!',
                result: {
                    email: result.email,
                    city: result.city,
                    street: result.street,
                    fname: result.fname,
                    lname: result.lname,
                    role: result.role
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
    });
});

router.post('/login', ( req, res, next ) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then( user => {
        if( !user ) {
            return res.status(401).json({
                massage: 'Auth Failed'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then( result => {
        if( !result ) {
            return res.status(401).json({
                massage: 'Auth Failed'
            });
        }

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id, name: fetchedUser.fname },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            token: token,
            expiresIn: 3600,
            name: fetchedUser.fname

        })
    })
    .catch(err => {
        return res.status(401).json({
            massage: 'Auth Failed'
        });
    });
});

module.exports = router;