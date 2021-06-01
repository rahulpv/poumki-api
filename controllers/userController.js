// Load required packages
var randomstring = require("randomstring");


var User = require('../models/user');
var isJson = require('../helpers/isJson');





// Create endpoint /users for POST
exports.postUser = function(req, res) {

    let data = [];
    let response = {};
    var jsonData = req.body

    if(isJson(jsonData)){

        var user = new User(jsonData);


        user.save(function(err, responseData) {
            if (err){

                var error = ""
                if(err.errors && err.errors.firstName){
                    error = err.errors.firstName.message
                }else if(err.errors && err.errors.lastName){
                    error = err.errors.lastName.message
                }else if(err.errors && err.errors.email){
                    error = err.errors.email.message
                }else if(err.errors){
                    error = err.errors
                }else{
                    //error = err.name
                    error = err
                }
                response = {status : 400 ,message : error, data : {} };

                return res.status(400).json(response);
            }else{

                var io = req.app.get('socketio');

                io.sockets.emit('user updated');


                response = {status : 200 ,message : 'Success' , data : responseData };
                res.status(200).json(response);


             }

        });

    }else{
        response = {status : 400 ,message : 'Invalid Json' , data : {} };
        res.status(400).json(response);
    }

};


// Create endpoint /users for GET
exports.getUsers = function(req, res) {
    var status = 200;
    var message = 'Success';
    var data = {};
    var page = 1;
    var limit = 10;

    if(! isNaN(req.query.page) && req.query.page > 0 && ! isNaN(req.query.limit) && req.query.limit > 0){
        page  = req.query.page;
        limit  = req.query.limit;
    }
    User.paginate( { }, { select:'firstName lastName userName email createdAt',
        page: page, limit: limit,  sort: { createdAt: -1 } }).then(function (users) {

        if(users.total > 0){

            data = {
                users : users.docs,
                total  : users.total,
                limit  : users.limit,
                page   : users.page,
                pages  : users.pages,
            };

            response = {status : 200 ,message : 'Success' , data : data };
            res.status(200).json(response);

        }else{
            response = {status : 400 ,message : 'No users found' , data : data };
            res.status(400).json(response);
        }

    }).then(null, function (err) {
        // handle error here
        response = {status : 400 ,message : "System Error" , data : [] };
        return res.status(400).json(response);
    });


};


// Create endpoint /users for DELETE
exports.deleteUser = function(req, res) {

    User.findOne({ _id:req.params._id}).exec().then(function (user) {
        if(user){
            user.remove();


            var io = req.app.get('socketio');

            io.sockets.emit('user updated');



            response = {status : 200 ,message : 'User removed' , data : {} };
            res.status(200).json(response);


        }else{
            response = {status : 200 ,message : 'No User found' , data : {} };
            res.status(200).json(response);
        }

    }).then(null, function (err) {
        // handle error here
        response = {status : 200 ,message : "System Error" , data : {} };
        return res.status(200).json(response);
    });

};
