const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title: { type : String , required : true},// javascript has a capital S in String instead of small s in typescript
  content : { type : String , required : true},
  imagePath:{type : String , required:true},
  creator: {type:mongoose.Schema.Types.ObjectId, ref:"User",required:true} // reference to user model
});

module.exports = mongoose.model('Post', PostSchema);  // name of the shcema to be exported should
                                                      //start with a capital letter
