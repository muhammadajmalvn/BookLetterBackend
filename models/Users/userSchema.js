const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    postcode: { type: String, required: true },
    state: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    photo: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    address: {
        type: [addressSchema],
        default: []
    },
    verifytoken: {
        type: String,
    }

},
    {
        timestamps: true
    }
)

const model = mongoose.model('User', userSchema)
module.exports = model