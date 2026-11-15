const mongoose = require('mongoose')

// 4.16*: Blog List Expansion, step 4
// Add a feature which adds the following restrictions to creating new users:
// Both username and password must be given and both must be at least 3 characters
// long. The username must be unique.

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  name: String,
  passwordHash: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
