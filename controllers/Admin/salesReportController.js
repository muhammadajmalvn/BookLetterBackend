const orderSchema = require('../../models/Bookings/OrderSchema')

exports.getSalesReportDetails = async (req, res) => {
    try {
        orderSchema.find().sort({ createdAt: -1 }).then((data) => {
            res.status(200).json(data);
        })
    } catch (error) {
        res.status(400).json('error getting sales report details')
    }
}