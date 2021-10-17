const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  email: { type : String , required : true, unique : true},// unique does not validate uniqueness of the field
  //                                                          is used for mongo interal optimization
  password : { type : String , required : true},
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);  // name of the shcema to be exported should
                                                      //start with a capital letter
