const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  displayName: { type: String }
})

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;