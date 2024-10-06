const { Schema, model } = require("mongoose");
const User = require("./user")

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,  // Corrected from 'string' to 'String'
            required: true,
        },
        coverImageUrl: {
            type: String,  // Corrected from 'string' to 'String'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: User,  // Ensure 'User' matches the model name exported in your user model
        },
    },
    { timestamps: true }  // Corrected from 'timeStamps' to 'timestamps'
);

const blog = model("blog", blogSchema);  // Conventionally models are named in singular
module.exports = blog;  // Export the Blog model
