const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const logger = require('morgan');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

/* middleware */
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/* routes */
const indexRouter = require('./routes/indexRoute');

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
