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

  },

  /*Fonction de Follow d'une personne*/
  Follow: function(req,res){
   // var USER = res.session.user;

    var Id = req.param("id");

    var currentUser = req.session.user;
   
    //Nous recherchons l'utilisateur associé
     User.findOne({id: Id},function(err,user){
        if(err)  res.json({success: false, error:'Une erreur est survenue : '+err});
       // console.log(user);

       //Si il y un user
       if(user)
       {
        
        currentUser.following.add(user);

        currentUser.save(function(err){console.log(err);});

        res.json({success: true});


       }
       else{
        res.json({success: false, error: 'User non trouvé'});
       }
       
      

     });
  },

  CreateGab: function(req,res){

    //récuperation du user courant
    var Currentuser = req.session.user;

    var NewGab = {

        owner: Currentuser,
        title: req.param("title"),
        content: req.param("content")


    };


    Currentuser.gabs.add(NewGab);

    Currentuser.save(function(err){

      if(err){
         res.json({success: false, error: err});
      }
      else{
        res.json({success: true});
      }
     


    });

    
  },

  LikeGab: function(req,res){


    var CurrentUser = res.session.user;

    var IdGab = req.param("gabId");

    Gab.findOne(IdGab).exec(function(err,gab){

      if(err)  res.json({success: false,error: err});

      if(gab){

        //Le Gab existe bien

        CurrentUser.GabLiked.add(gab);

        CurrentUser.save(function(err){

        if(err){

                res.json({success: false, error: err});

              } 
        else{

              res.json({success: true});

              }

        });

      }
      else{

          res.json({success: false, error: "Ce Gab est introuvable"});
      }


    });


  }




 
 
});