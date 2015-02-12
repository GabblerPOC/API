/**
 * UserController.js 
 * 
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *                 
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({
  /* e.g.
    action: function(req, res){
  
    }
  */

  //Fonction de test
  open: function(req,res){

  	res.send("Fonction ouverte");

  },


  restricted: function(req,res){

  	res.send("Fonction restricted");
    console.log(req.session.user);

  }
 
 
});