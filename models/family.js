const mongoose=require('mongoose');

//Setting up userSchema
const familySchema=new mongoose.Schema({
    id:{
        type: String,
        required:true,
        unique:true
    },
    parent:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    spouse:{
        type:String
    },
    location:{
        type:String
    },
    birthYear:{
        type:String
    },
    address:{
        type:String
    }
},{timestamps:true});

//Setting up User model
const Family=mongoose.model('Family',familySchema);

//Exporting User model
module.exports=Family;