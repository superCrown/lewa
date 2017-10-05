var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email : {
        type : String,
        required: [true, '이메일은 필수입니다.'],
        unique :true
    },
    password : {
        type : String,
        required: [true, '패스워드는 필수입니다.'],
    },
    nickname : {
        type : String,
        trim : true,
        required: [true, '닉네임은 필수입니다.'],
        unique :true
    },
    displayname : {
        type : String,
        required: [true, '성명은 필수입니다.']
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
});

UserSchema.pre("save", hashPassword);
UserSchema.pre("findOneAndUpdate", function hashPassword(next){
  console.log(this._update);
  var user = this._update;
  if(!user.newPassword){
    delete user.password;
    return next();
  } else {
    user.password = bcrypt.hashSync(user.newPassword);
    return next();
  }
});

UserSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
  };
  UserSchema.methods.hash = function (password) {
    return bcrypt.hashSync(password);
  };
  var User = mongoose.model('user',UserSchema);

UserSchema.plugin( autoIncrement.plugin , 
    {
        model : "user", field : "id" , startAt : 1 
    });


module.exports = mongoose.model('user' , UserSchema);


function hashPassword(next){
    console.log("hi");
    var user = this;
    if(!user.isModified("password")){
      return next();
    } else {
      user.password = bcrypt.hashSync(user.password);
      return next();
    }
  }