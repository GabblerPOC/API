/**
 * Auth
 *
 * @module      :: Model
 * @description :: Holds all authentication methods for a User
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.auth.attributes({
    
    /* e.g.
    nickname: 'string'
    */

     /*Override de la fonction toJSON pour enlever le mot de passe*/
    toJSON: function() {
    	var obj = this.toObject();
    	delete obj.password;
    	return obj;	

    }
    
  }),
  
  beforeCreate: require('waterlock').models.auth.beforeCreate,
  beforeUpdate: require('waterlock').models.auth.beforeUpdate
};
