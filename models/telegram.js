const mongoose = require("mongoose")

const schema = mongoose.Schema({
  chat_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("Telegrams", schema)