const mongoose = require("mongoose")
const Schema = mongoose.Schema


const schema = mongoose.Schema({
    userId: {
        type: Schema.ObjectId,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Tokens", schema)