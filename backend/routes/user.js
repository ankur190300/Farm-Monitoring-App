const express = require('express'); // only for the router so no need to export to controller

const router = express.Router(); // used to keep all the routes
const userController = require('../controller/userController');


// without using controllers and writing the functions here only
/*
router.post("/signup", (req, res, next)=>{

  bcrypt.hash(req.body.password,10)
  .then(hash=>{
    const user = new User({
      email:req.body.email,
      password:hash
    });
    user.save()
      .then(result=>{
        res.status(201).json({
          message:'User Created',
          result:result
        });
      })
      .catch(err=>{
        res.status(500).json({
          message:"Invalid Authentication credentials !"
        });
      });
  })

})
*/

router.post("/signup", userController.CreateUser);
router.post("/login", userController.UserLogin);
module.exports = router ;
