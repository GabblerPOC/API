/**
 * GabController
 *
 * @description :: Server-side logic for managing Gabs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
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

};

