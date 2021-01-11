'use strict';
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const chalk = require('chalk');

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', require('./services'));

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(chalk.green(`Server listening on port: ${PORT}`), chalk.yellow(' -- \u2708'));
});
