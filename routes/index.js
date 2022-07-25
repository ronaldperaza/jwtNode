const express = require('express')
const { registerUser, loginUser, dashboard } = require('../controllers/user.controller');
 const verifyToken = require('../middlewares/validateToken');

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/user', router);
    app.use('/api/dashboard', verifyToken, dashboard);

    router.post('/register', registerUser)
    router.post('/login', loginUser)
    router.get('/', dashboard)
}

module.exports = routerApi;