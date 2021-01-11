'use strict';

module.exports = function(app) {
    app.use('/api/auth', require('../controller/auth'));
    app.use('/api/user/', require('../controller/users'));
}