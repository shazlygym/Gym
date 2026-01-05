
const mongoose = require('mongoose')
const Joi = require('joi')



const userSchema = new mongoose.Schema({
    name:{
type:String
    },
    email:{
        type:String,
        
    },
    password:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    
    joinDate:{
        type:Date,
        default: Date.now 
    },

    totalDays:{
        type:Number,
        default: 0 
    },

    usedDays:{
        type:Number,
        default: 0 
    },
    admin:{
        type:Boolean,
        default: 0 
    },
    gymVisits: {
        type: [String], // 👈 مصفوفة نصوص (كل نص يحتوي التاريخ والساعة)
        default: [],
      },
      videosName:{
type:String,
default:""
      },
    videos: {
        type: [String], // 👈 مصفوفة من النصوص (تقدر تخليها Object أو Number)
        default: []     // 👈 تبدأ فاضية
      },
      seq:{
        type:Number,
      },
      comment:{
        type:String,
      },
      packageName:{
        type:String
      }

},{timestamps:true})

const User = mongoose.model("user",userSchema)

function userValidation (object){
    const schema  = Joi.object({
        name:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required(),
        mobileNumber:Joi.string().required()
    })
    return schema.validate(object)
}



module.exports= {User,userValidation}