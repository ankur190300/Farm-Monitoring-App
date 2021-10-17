const express = require('express');
const path = require('path') ;
const bodyParser = require('body-parser');// extract incoming request data and
                                         //add it as an extra field in that request
                                         // does not work for files like image etc
                                         // but will work for json and urlencoded

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');

const app = express();
var cors = require('cors');
const { RSA_NO_PADDING } = require('constants');



//const { Ptor } = require('protractor');
mongoose.connect("mongodb+srv://ankur:"+ process.env.MONGO_ATLAS_PW +"@cluster0.otf8g.mongodb.net/udemy-mean?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connection to the database established ");
})
.catch(()=>{

  console.log("Connection failed :( ") ;
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/images', express.static(path.join("backend/images")));

// app.use((req, res, next)=>{

//   console.log("First middleware");
//   next(); // calls second middleware in this file only
// });

// app.use((req, res, next)=>{

//   console.log("second middleware");
//   res.send("Hello from the second middleware of express");
// })


// To help with CORS - cross origin resource sharing ( sharing across different servers )
app.use(cors())
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type , Accept, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods",
    " DELETE , GET , POST , PATCH  , OPTIONS");
    next();
})


app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);


module.exports = app ;


