const mongoose = require("mongoose")

const schema = mongoose.Schema({
  time: {
    type: Number,
    required: true,
  },
  inWork: {
    type: Boolean,
    required: true,
  }
})

module.exports = mongoose.model("Task", schema)