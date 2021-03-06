const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/index');
const users = require('./routes/users');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const async = require('async');
const cloudinary = require('cloudinary');

// Database connection
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://hotsource:fvXs8b46pzx5YpL@hotsource-fmxxz.mongodb.net/test?retryWrites=true'
, { useNewUrlParser: true })
.then(() => { console.log('SERVER UP')})
.catch((e) => { console.log(e)});

// define Cloudinary
cloudinary.config({ 
  cloud_name: 'supermarketapp', 
  api_key: '784319497175699', 
  api_secret: '_zTQ2GSn3mb--OMytCzS0GujV70' 
});

// initialize middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("./images")));
app.use(cookieParser());

// initialize CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

// connect routes
app.use('/', routes);
app.use('/users', users);

module.exports = app;
