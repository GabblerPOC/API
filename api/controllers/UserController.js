/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
var path = require("path");


var UPLOAD_PATH_AVATAR = '../../assets/images/avatar';
var UPLOAD_PATH_BACKGROUND = '../../assets/images/background';


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
  Follow: function (req, res) {
    // var USER = res.session.user;

    var Id = req.param("id");

    var currentUser = req.session.user;
    if (Id != currentUser.id) {
      //Nous recherchons l'utilisateur associé
      User.findOne({id: Id}, function (err, user) {
        if (err)  res.json({success: false, error: 'Une erreur est survenue : ' + err});
        // console.log(user);

        //Si il y un user
        if (user) {

          currentUser.following.add(user);

          currentUser.save(function (err) {
            console.log(err);
          });

          res.json({success: true});


        }
        else {
          res.json({success: false, error: 'Utilisateur non trouvé'});
        }


      });
    }
    else {
      res.json({success: false, error: 'Vous ne pouvez pas vous follow'});
    }

  },

  /*Fonction d'unfollow d'une personne */

  UnFollow: function(req, res){
     // var USER = res.session.user;

    var Id = req.param("id");

    var currentUser = req.session.user;
    if (Id != currentUser.id) {
      //Nous recherchons l'utilisateur associé
      User.findOne({id: Id}, function (err, user) {
        if (err)  res.json({success: false, error: 'Une erreur est survenue : ' + err});
        // console.log(user);

        //Si il y un user
        if (user) {

          currentUser.following.remove(Id);

          currentUser.save(function (err) {
            console.log(err);
          });

          res.json({success: true});


        }
        else {
          res.json({success: false, error: 'Utilisateur non trouvé'});
        }


      });
    }
    else {
      res.json({success: false, error: 'Vous ne pouvez pas vous unfollow'});
    }

  },

  CreateGab: function (req, res) {

    //récuperation du user courant
    var Currentuser = req.session.user;

    var NewGab = {

      owner: Currentuser,
      title: req.param("title"),
      content: req.param("content")


    };


    Currentuser.gabs.add(NewGab);

    Currentuser.save(function (err) {

      if (err) {
        res.json({success: false, error: err});
      }
      else {
        res.json({success: true});
      }


    });


  },

  DeleteGab: function (req, res) {

    //récuperation du user courant
    var Currentuser = req.session.user;

    var IDGab = req.param("id");

    Gab.findOne({id: IDGab}, function(err, gab){
      if (err)  res.json({success: false, error: 'Une erreur est survenue : ' + err});

      if(gab){
          console.log(gab);
          if(gab.owner == Currentuser.id){
            Gab.destroy({id: IDGab}, function(err){
              if (err)  res.json({success: false, error: 'Une erreur est survenue : ' + err});
              res.json({success:true});
            });
          }else{
            res.json({success:false,error:"Forbidden"});
          }
      }else{
        res.json({success:false, error:"Aucun Gab trouvée"});
      }

    });
   
    
    

    


  },

  LikeGab: function (req, res) {


    var CurrentUser = req.session.user;

    var IdGab = req.param("id");

    Gab.findOne(IdGab).exec(function (err, gab) {

      if (err)  res.json({success: false, error: err});

      if (gab) {

        //Le Gab existe bien

        CurrentUser.GabLiked.add(gab);

        CurrentUser.save(function (err) {

          if (err) {

            res.json({success: false, error: err});

          }
          else {

            res.json({success: true});

          }

        });

      }
      else {

        res.json({success: false, error: "Ce Gab est introuvable"});
      }


    });


  },

  UnLikeGab: function (req, res) {


    var CurrentUser = req.session.user;

    var IdGab = req.param("id");

    Gab.findOne(IdGab).exec(function (err, gab) {

      if (err)  res.json({success: false, error: err});

      if (gab) {

        //Le Gab existe bien

        CurrentUser.GabLiked.remove(IdGab);

        CurrentUser.save(function (err) {

          if (err) {

            res.json({success: false, error: err});

          }
          else {

            res.json({success: true});

          }

        });

      }
      else {

        res.json({success: false, error: "Ce Gab est introuvable"});
      }


    });


  },

  GetTimeLine: function (req, res) {

    var CurrentUser = req.session.user;
    //Objets qui  va contenir tout les gabs

    var following = [];
    var GabsFromUser = [];

    //On recupere tout ceux qu'ils follow et on affiche leur gabs

    User.findOne(CurrentUser.id)
      .populate("following")      
      .exec(function (err, user) {
        if (err) res.json({success: false, error: err});
          

        for (var i = 0; i < user.following.length; i++) {
          following.push(user.following[i].id);
        }

        //On ajoute l'utilisateurs dans les gabs a recup
        following.push(CurrentUser.id);

        //Pour chaque personne on récupère leur gabs
        Gab.find({
          owner: following
        })
        .populate("owner")
        .exec(function (err, gab) {
            
            if (err) res.json({success: false, error: err});
            //On ajoute les Gabs dans notre tableaux de retour
            res.json({gabs: gab});


          });


      });


  },

  ModifierProfile: function (req, res) {

    var currentUser = req.session.user;

    var ModifUser = {

      Name:req.param("Name"),
      LastName:req.param("LastName"),
      Age:req.param("Age"),


    };
   



    

    console.log(ModifUser);


    

      User.update({id: currentUser.id}, ModifUser, function (err, user) {
        if (err) res.json({success: false, error: err});

        if (user) {

          if(req.param("password")){
        
            var ModifAuth = {
              password: req.param("password")
            }
            
            Auth.update(user.auth, ModifAuth, function (err, auth) {
               if (err) res.json({success: false, error: err});

               console.log(auth);
                if (auth) {
                  res.json({success: true});
              }
                

            });
          }
          res.json({success: true});
        }

      });


    


  },

  ModifierBackground: function (req, res) {

    var currentUser = req.session.user;
    var file = req.file("file");
    var ModifUser = {};
   

    if (file) {

      file.upload({dirname: UPLOAD_PATH_BACKGROUND}, function onUploadComplete(err, files) {

        if (err) return res.serverError(err);

       
        var NameFile = path.basename(files[0].fd);
        var PATH = "/images/background/"+ NameFile;

        console.log(PATH);
        ModifUser.UrlBackGround = PATH;

        

        User.update({id: currentUser.id}, ModifUser).exec(function (err, user) {
          if (err) res.json({success: false, error: err});

          if (user) {
            console.log(user);
            res.json({success: true});
          }

        });


      });

    }
    else {

     res.json({success:false});


    }


  },

  ModifierAvatar: function (req, res) {

    var currentUser = req.session.user;
    var file = req.file("file");
    var ModifUser = {};
   

    if (file) {

      file.upload({dirname: UPLOAD_PATH_AVATAR}, function onUploadComplete(err, files) {

        if (err) return res.serverError(err);

         var NameFile = path.basename(files[0].fd);
        var PATH = "/images/background/"+ NameFile;
        
        console.log(PATH);
        ModifUser.UrlAvatar = PATH;

        

        User.update({id: currentUser.id}, ModifUser).exec(function (err, user) {
          if (err) res.json({success: false, error: err});

          if (user) {
            console.log(user);
            res.json({success: true});
          }

        });


      });

    }
    else {

     res.json({success:false});


    }


  }



});
