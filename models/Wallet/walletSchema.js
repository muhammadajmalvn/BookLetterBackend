const mongoose = require('mongoose');
const moment = require('moment')

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    walletAmount: {
        type: Number,
    },
    walletHistory: {
        type: [
            {
                amountAdded: {
                    type: Number,
                },
                amountDeducted: {
                    type: Number,
                },
                transactionType: {
                    type: String
                },
                Date: {
                    type: String,
                    default: moment().format('MMMM Do YYYY')
                }

            }
        ]
    }
}, { timeStamps: true }
)
const model = mongoose.model("Wallet", walletSchema)
module.exports = model