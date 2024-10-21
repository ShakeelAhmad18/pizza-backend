const mongoose=require('mongoose')

const tableSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Add Name']
        },
        email:{
            type:String,
            trim:true,
            required:[true,'Add Email'],
            match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email validation
        },
        phone:{
            type:String,
            required:[true,'Add Phone Number']
        },
        date:{
            type:Date,
            required:true
        },
        Time:{
            type:String,
            required:true
        },
        persons:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Table=mongoose.model('Table',tableSchema);
module.exports=Table;