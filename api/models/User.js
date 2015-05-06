/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    
   /* Attribut des Users */

    Name: {
      type:'string',
      
    },

    LastName: {
      type:'string',
      
    },

    Age: {

      type: 'Integer',
      
    },

    /*Liaisons a tout les posts/Gabs de l'utilisateur*/
    gabs: {
      collection: "gab",
      via: "owner"
    },

    role: {
      type: 'string',
      defaultsTo: 'user'
    },

    /*Gestion des followers*/
    following: {
      collection: 'user',
      via: 'followers'
    },

    /*Gestion de ceux que l'on follow*/
    followers: {
      collection: 'user',
      via: 'following'
    },

    /*Gestion des GabLiker */

    GabLiked: {
      collection: 'gab',
      via: 'Likers'
    },

    UrlBackGround: {
      type: 'string'
    },


    /*Override de la fonction toJSON pour enlever le mot de passe*/
    toJSON: function() {
    	var obj = this.toObject();
    	delete obj.password;
    	return obj;	

    }
    
  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate
};
