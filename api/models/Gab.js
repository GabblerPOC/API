/**
* Gab.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {


  	owner: {
      model: 'user'
    },

  	title: {
  		type: 'string',
  		required: 'true'
  	},

  	content: {
  		type: 'string',
  		required: 'true'
  	},

    Likers: {

      collection: 'user',
      via: 'GabLiked'
      
    }



  	/*Gestion des likes*/

   

  }
};

