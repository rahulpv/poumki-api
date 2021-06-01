'use strict';


module.exports = function(app) {



/***********************User***********************/

  var userController = require('../controllers/userController');
  app.route('/users')
      .get(userController.getUsers)
      .post(userController.postUser).all(methodNotAllowedHandler);
  app.route('/user/:_id')
      .delete(userController.deleteUser).all(methodNotAllowedHandler);


  /***********************User***********************/

  function methodNotAllowedHandler(req, res) {

  var response = {status : 405 ,message : "Method Not Allowed" , data : [] };
  res.status(405).json(response);

}

};
