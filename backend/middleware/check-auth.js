const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
  console.log(req.headers.authorization);
  try{
    const token = req.headers.authorization.split(" ")[1]; // because the pattern we expect is
    //                                                       "bearer asdfsdajsdfadsdf " therefore we
    //                                                        want second word asdfsdajsdfadsdf(which is the token)
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email:decodedToken.email, userId:decodedToken.userId}; // add and extra field containing
    // decoded token for the requests passing this middleware
    next();

  }
  catch(error){

    return res.status(401).json({
      message:"You are not authenticated !"
    });
  }



}
