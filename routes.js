const { Router } = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const verifyToken = require('./controllers/verifyToken');

const routes = Router();

routes.post('/login', SessionController.login);

routes.get('logout', SessionController.logout);

routes.post('/users', UserController.store);

routes.use(verifyToken);

routes.get('/users', UserController.index);

routes.get('/users/:id', UserController.show);

routes.put('/users/:id', UserController.update);

routes.delete('/users/:id', UserController.destroy);

module.exports = routes;