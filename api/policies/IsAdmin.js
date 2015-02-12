'use strict';
/* jshint unused:false */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
  waterlock.validator.validateTokenRequest(req, function(err, user){
    if(err){
      return res.forbidden(err);  
    }
    if(user.role!='Admin'){
    	return res.forbidden("Vous n'avez pas les droits nécéssaires !");
    }
    
    
    // valid request
    next();
  });
};
