var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");
var autoIncrement = require('mongoose-auto-increment');

// schema
var userSchema = mongoose.Schema({
  id : {
    type : Number
  },
  email:{
    type:String,
    required:[true,"이메일은 필수입니다."],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일 양식에 맞춰주세요."],
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:[true,"패스워드는 필수입니다."],
    select:false
  },
  name:{
    type:String,
    required:[true,"닉네임은 필수입니다."],
    match:[/^.{4,12}$/,"닉네임은 4~12글자 사이입니다."],
    trim:true,
  }
},{
  toObject:{virtuals:true}
});

autoIncrement.initialize(mongoose.connection);

userSchema.plugin( autoIncrement.plugin , 
  {
      model : "User", field : "id" , startAt : 1 
  });

// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "비밀번호는 최소 8글자이며 알파벳과 숫자를 혼용해주세요";
userSchema.path("password").validate(function(v) {
  var user = this;

  // create user
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "비밀번호를 확인해주세요");
    }
    if(!passwordRegex.test(user.password)){
      user.invalidate("password", passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }

  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      if(ValidationError){
      user.invalidate("currentPassword", "현재 비밀번호를 입력해주세요");
    }
    }
    if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "현재 비밀번호가 일치하지 않습니다.");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }
});

// hash password
userSchema.pre("save", function (next){
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model("user" , userSchema);
module.exports = User;
