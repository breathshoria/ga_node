const mongoose = require('mongoose')

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
        required: true,
    }
})

module.exports = mongoose.model("Users", schema)