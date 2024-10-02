const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userid: {
        type: Number,
        required: true
    },
    access_token: {
        type: String,
        required: true
    }
})

const Users = mongoose.model("users", UserSchema)

module.exports = Users
