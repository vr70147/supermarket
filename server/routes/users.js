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
            password: hash
        });
        user.save()
        .then( result => {
            res.status(201).json({
                massage: 'User created!',
                result: result
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
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: '10h' }
        );
        res.status(200).json({
            token: token
        })
    })
    .catch(err => {
        return res.status(401).json({
            massage: 'Auth Failed'
        });
    });
});
module.exports = router;