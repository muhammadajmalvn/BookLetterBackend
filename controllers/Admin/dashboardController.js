const userSchema = require('../../models/Users/userSchema')
const orderSchema = require('../../models/Bookings/OrderSchema')
const bookSchema = require('../../models/Books/bookSchema')
const sellRequestSchema = require('../../models/SellRequests/sellRequests')

exports.getDashboardDetails = async (req, res) => {
    try {
        const [
            totalUsers,
            totalBooks,
            totalSellRequests,
            totalOrders,
            totalPlacedOrders,
            totalShippedOrders,
            totalDeliveredOrders,
            totalPendingRequests,
            totalRejectedRequests,
            totalShippedRequests,
            totalReceivedRequests,
            totalAcceptedRequests] = await Promise.all([
                userSchema.countDocuments(),
                bookSchema.countDocuments(),
                sellRequestSchema.countDocuments(),
                orderSchema.countDocuments(),
                orderSchema.countDocuments({ status: "placed" }),
                orderSchema.countDocuments({ status: "shipped" }),
                orderSchema.countDocuments({ status: "delivered" }),
                sellRequestSchema.countDocuments({ status: "pending" }),
                sellRequestSchema.countDocuments({ status: "rejected" }),
                sellRequestSchema.countDocuments({ status: "shipped" }),
                sellRequestSchema.countDocuments({ status: "received" }),
                sellRequestSchema.countDocuments({ status: "accepted" }),
            ])

        const orderTotalAmount = await orderSchema.aggregate(
            [
                {
                    '$group': {
                        '_id': null,
                        'totalAmount': {
                            '$sum': '$totalAmount'
                        }
                    }
                }
            ]
        )
        const data = {
            totalUsers,
            totalBooks,
            totalSellRequests,
            totalOrders,
            totalPlacedOrders,
            totalShippedOrders,
            totalDeliveredOrders,
            totalPendingRequests,
            totalRejectedRequests,
            totalShippedRequests,
            totalReceivedRequests,
            totalAcceptedRequests,
            totalAmountCollected: orderTotalAmount[0]?.totalAmount || 0
        }
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json("error getting dashboard data")
    }
}