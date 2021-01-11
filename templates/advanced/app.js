'use strict';
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const chalk = require('chalk');

app.use(morgan('dev'));
app.use(helmet());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').config();
require('./config/db.mongoose');
require('./config/routes')(app);
require('./config/errorHandler')(app);
require('./config/passport');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(chalk.green(`Server listening on port: ${PORT}`), chalk.yellow(' -- \u2708'));
});
