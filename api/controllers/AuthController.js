/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').waterlocked({
  /* e.g.
    action: function(req, res){
  
    }
  */

  register: function(req,res){

  	var Email = req.param("email");
  	var AUTH = {

  		email: req.param("email"),
  		password: req.param("password")  		
  	};

  	var userObj = {
  			Name: req.param("Name"),
  			LastName: req.param("LastName"),
  			Age: req.param("Age")
  		};

  		User.create(userObj).exec(function(err,user){

 			waterlock.engine.attachAuthToUser(AUTH,user,function(err,user){
 				if(err) {
 					User.destroy(user,function(err){

 						res.json({success:false,error: err});
 						
 					});
 					
 				}

 				if(user){

 						res.json({success:true,user: user});
 				}

 			});
  	});

}
  	
});