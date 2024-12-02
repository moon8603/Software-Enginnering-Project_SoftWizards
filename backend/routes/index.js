var express = require('express');
var router = express.Router();

/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

router.get('/', (req, res) => {
  try {
      res.json({
          message: 'Welcome to NodeJS App. You can now use tools like Postman or curl to test the following endpoints:',
          endpoints: [
              { method: 'GET', route: '/loginpage/:id', description: 'Get a user by ID.' }
              /*{ method: 'POST', route: '/users', description: 'Create a new user.' },
              { method: 'GET', route: '/users', description: 'Get all users.' },
              { method: 'PUT', route: '/users/:id', description: 'Update a user by ID.' },
              { method: 'DELETE', route: '/users/:id', description: 'Delete a user by ID.' }*/
          ]
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;
