const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique:true
    },

    email: {
      type: String,
      required: true,
      unique:true
    },

    password: {
      type: String,
      required: true
    },

    branch:{
      type: String,
      required: true,
      enum: ['CS', 'IT', 'EXTC', 'PPT']
    },

    year:{
      type: String,
      required: true,
      enum: ['FE', 'SE', 'TE', 'BE']
    },
  },
  {collection: 'users'}
)

const model = mongoose.model('UserSchema', UserSchema)
module.exports = model