const express = require('express');
const app = express();
const routes = require('./routes/index');
const users = require('./routes/users');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Data base connection
mongoose.connect('mongodb://hotsource:fvXs8b46pzx5YpL@hotsource-shard-00-00-fmxxz.mongodb.net:27017,hotsource-shard-00-01-fmxxz.mongodb.net:27017,hotsource-shard-00-02-fmxxz.mongodb.net:27017/test?ssl=true&replicaSet=hotsource-shard-0&authSource=admin&retryWrites=true')
.then(() => { app.listen('3000', () => { console.log('SERVER UP')}) })
.catch((err => { console.log('COULD NOT CONNECT SERVER')}));

// initialize middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// // initialize session
// app.use(session({
//     secret: "ilovehotsource",
//     resave: false,
//     saveUninitialized: false,
//     name: 'user_cook',
//     cookie: {
//       httpOnly: false,
//       maxAge: 10000 * 600 * 5
//     },
//     store: new MongoStore({
//       url: 'mongodb://hotsource:fvXs8b46pzx5YpL@hotsource-shard-00-00-fmxxz.mongodb.net:27017,hotsource-shard-00-01-fmxxz.mongodb.net:27017,hotsource-shard-00-02-fmxxz.mongodb.net:27017/test?ssl=true&replicaSet=hotsource-shard-0&authSource=admin&retryWrites=true'
//     })
//   }));

// connect routes
app.use('/', routes);
app.use('/users', users);
