const mongoose = require("mongoose")


const addressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true }
});
const orderSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId // Change the type to ObjectId
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    bookedTimePeriod: {
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    address: {
        type: addressSchema
    },
    copyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    totalDays: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    stripeSessionId: {
        type: String
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId
    }, 
    paymentType: {
        type: String
    },
    status: {
        type: String,
        default: 'placed',
    }, statusHistory: {
        type: [{
            status: {
                type: String,
                default: 'placed'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
        default: [{
            status: 'placed',
            date: Date.now()
        }]
    }

}, {
    timestamps: true
}
)

const model = mongoose.model("Order", orderSchema)

module.exports = model