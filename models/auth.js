const {Schema} = require('mongoose');
var mongoose = require('mongoose');

const authSchema = new Schema(
    {
        email: {
            type: String
        },

        password: {
            type: String
        },

    }
)
const auth = mongoose.model("logins",authSchema);
module.exports = auth;