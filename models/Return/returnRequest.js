const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId
    },
    copyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})

const model = mongoose.model('Return', returnSchema)
module.exports = model
