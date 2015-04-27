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

  

  /*Fonction de Follow d'une personne*/
  Follow: function(req,res){
   // var USER = res.session.user;

    var Id = req.param("id");

    var currentUser = req.session.user;
   if(Id != currentUser.id){
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
        res.json({success: false, error: 'Utilisateur non trouvé'});
       }
       
      

     });
   }
   else{
    res.json({success: false, error: 'Vous ne pouvez pas vous follow'});
   }
   
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


    var CurrentUser = req.session.user;

    var IdGab = req.param("id");

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


  },

  GetTimeLine: function(req,res){

      var CurrentUser = req.session.user;
      //Objets qui  va contenir tout les gabs
      var Gabs = [];
      var following = [];

      //On recupere tout ceux qu'ils follow et on affiche leur gabs
     
      User.findOne(CurrentUser.id) 
      .populate("following")       
      .exec(function(err,user){
        if(err) res.json({success:false,error: err});

        
        for(var i=0;i<user.following.length;i++){
          following.push(user.following[i].id);
        }
          
         //Pour chaque personne on récupère leur gabs
        
          
          Gab.find({
            owner: following
          })                 
          .exec(function(err,gab){
           
            if(err) res.json({success:false, error: err});
            //On ajoute les Gabs dans notre tableaux de retour
            res.json({gabs: gab});

           
            
          });



        

       

      })

      

  }


  



 
 
});