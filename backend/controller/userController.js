const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.CreateUser = (req, res, next)=>{

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

};

exports.UserLogin = (req, res, next)=>{
  let fetchedUser;
  User.findOne({email:req.body.email})
  .then(user=>{
    if(!user){
      return res.status(401).json({
        message:"Auth Failed"
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password); // as this is a promise so more then calls can be
    //                                                          chained to it

  })
  .then(result=>{
    if(!result){ // the comparison is false
      return res.status(401).json({
        message:"Auth Failed"
      })
    }
    const token = jwt.sign( // token is decoded not encrypted
      {email:fetchedUser.email , userId:fetchedUser._id}, // info to be sent to front end
      process.env.JWT_KEY, // password used to encrypt json
      {expiresIn:'1h'} // time after which this token would expire , logging the user out
    );
    res.status(200).json({
      token : token,
      expiresIn : 3600,
      userId : fetchedUser._id
    })
  })
  .catch(err=>{
    return res.status(401).json({
      message:"Invalid Authentication credentials !"
    })
  })
};
