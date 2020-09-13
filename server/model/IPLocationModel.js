const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const IPLocationSchema = new Schema({
  ip: {
    type: String,
    unique: true,
    required: [true, 'IP is required']
  },
  isblackListed: {
    type: Boolean,
    default: true,
    required: [true, 'isblackListed is required']
  },
  country: Object
})

IPLocationSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = mongoose.model('IPLocation', IPLocationSchema)
