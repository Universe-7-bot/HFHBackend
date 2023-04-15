const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        }
    }, {
    timestamps: true
}
)

let User = mongoose.model("user", UserSchema);
module.exports = User;