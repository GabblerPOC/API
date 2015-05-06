/**
 * UserController.js 
 * 
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *                 
 * @docs        :: http://waterlock.ninja/documentation
 */

 var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');

var UPLOAD_PATH = 'public/images';

sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);


//Fonction upload
function safeFilename(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}
 
function fileMinusExt(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}
 
function fileExtension(fileName) {
  return fileName.split('.').slice(-1);
}
 
// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {
  console.log('Processing image');
 
  cb(null, {
    'result': 'success',
    'id': id,
    'name': name,
    'path': path
  });
}

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
      
      var following = [];
      var GabsFromUser = [];

      //On recupere tout ceux qu'ils follow et on affiche leur gabs
     
      User.findOne(CurrentUser.id) 
      .populate("following")  
      .populate("gabs")     
      .exec(function(err,user){
        if(err) res.json({success:false,error: err});

        GabsFromUser = user.gabs;
        for(var i=0;i<user.following.length;i++){
          following.push(user.following[i].id);
        }
          
         //Pour chaque personne on récupère leur gabs
        
          
          Gab.find({
            owner: following
          })                 
          .exec(function(err,gab){
           gab = gab.concat(GabsFromUser);
            if(err) res.json({success:false, error: err});
            //On ajoute les Gabs dans notre tableaux de retour
            res.json({gabs: gab});

           
            
          });



        

       

      })

      

  },

  ModifierProfile: function(req,res){
   
    var currentUser = req.session.user;

    var ModifUser = req.param("user") || {};
    
   
     var file = req.file("userPhoto");
     
     
     if(file){

      file.upload({ dirname: '../../public/avatar'},function onUploadComplete(err, files){

        if(err) return res.serverError(err);

        console.log(files);
        ModifUser.UrlBackGround = files[0].fd;

        console.log(ModifUser);

        User.update({Name: currentUser.Name},ModifUser).exec(function(err,user){
          if(err) res.json({success:false,error: err});

        if(user)
          {
            console.log(user);
            res.json({success:true});
          }

    });



     });

     }
     else{

      User.update(currentUser,ModifUser,function(err,user){
      if(err) res.json({success:false,error: err});

      if(user)
      {
        res.json({success:true});
      }

    });


     }
     

    


    }



  


  



 
 
});