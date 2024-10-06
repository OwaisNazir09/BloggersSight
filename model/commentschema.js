const { Schema, model } = require("mongoose");
const User = require("./user")
const Blog = require("./blogschema")

const commentschema = new Schema({
    content:{
        type : "String",
        required :true,
    },
    createdBy:{
        type : Schema.Types.ObjectId,
        ref :"User"
    },
    blogId:{
        type : Schema.Types.ObjectId,
        ref :"Blog"
    }

},{timestamps: true}); 

const comment = model("comment",commentschema   );


module.exports= comment;    