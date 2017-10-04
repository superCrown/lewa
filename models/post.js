var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var PostSchema = new Schema({
    title : {
        type : String,
        required: [true, '제목은 필수 입니다.']
    },
    body : {
        type : String,
        required: [true, '내용은 필수입니다.']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : { 
        type : Date
    }}, {
        toObject : {virtuals:true}
});

// virtuals // 3
PostSchema.virtual("createdDate")
.get(function(){
 return getDate(this.createdAt);
});

PostSchema.virtual("createdTime")
.get(function(){
 return getTime(this.createdAt);
});

PostSchema.virtual("updatedDate")
.get(function(){
 return getDate(this.updatedAt);
});

PostSchema.virtual("updatedTime")
.get(function(){
 return getTime(this.updatedAt);
});

//function

function getDate(dateObj){
    if(dateObj instanceof Date)
     return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
   }
   
   function getTime(dateObj){
    if(dateObj instanceof Date)
     return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
   }
   
   function get2digits(num){
    return ("0" + num).slice(-2);
   }


PostSchema.plugin( autoIncrement.plugin , 
    {
        model : "Post", field : "id" , startAt : 1 
    });

module.exports = mongoose.model("Post", PostSchema);
    