const orderSchema = require('../../models/Bookings/OrderSchema')
const bookSchema = require('../../models/Books/bookSchema')
const walletSchema = require('../../models/Wallet/walletSchema')
const dotenv = require('dotenv')
dotenv.config()
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const moment = require('moment');

exports.booking = async (req, res) => {
    try {
        console.log(req.body.bookingData);
        let { userId, bookId, bookData, totalAmount, totalDays, address, bookedTimePeriod, paymentType } = req.body.bookingData
        bookedTimePeriod.startDate = moment(bookedTimePeriod.startDate, 'DD MMMM YYYY').toDate();
        bookedTimePeriod.endDate = moment(bookedTimePeriod.endDate, 'DD MMMM YYYY').toDate();

        if (paymentType === 'stripe') {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: bookData.title,
                                images: [bookData.photo[0]],
                                description: bookData.description,
                                metadata: {
                                    book_id: bookId,
                                    totalDays: totalDays,
                                    startDate: bookedTimePeriod.startDate,
                                    endDate: bookedTimePeriod.endDate
                                }
                            },
                            unit_amount: totalAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: 'https://bookletter.netlify.app/booking-success',
                cancel_url: 'https://bookletter.netlify.app/cancel',
            })


            const available = await bookSchema.findOne(
                { _id: bookId },
                { copies: { $elemMatch: { available: true } } }
            );
            const copyId = available.copies[0]._id

            const order = new orderSchema({
                userId: userId,
                bookId: bookId,
                totalAmount: totalAmount,
                copyId: copyId,
                totalDays: totalDays,
                bookedTimePeriod: bookedTimePeriod,
                address: address,
                stripeSessionId: session.id,
                paymentType: paymentType

            });
            await order.save();
            console.log('Booking saved successfully');


            await bookSchema.updateOne(
                { _id: bookId, "copies._id": copyId },
                { $set: { "copies.$.available": false } }
            );
            const book = await bookSchema.findOneAndUpdate({ _id: bookId }, { $inc: { quantity: -1 }, $push: { bookedTimePeriod: bookedTimePeriod } })

            if (!book.bookedTimePeriod) {
                book.bookedTimePeriod = [bookedTimePeriod];
                await book.save();
            }
            res.send({ url: session.url })
        } else {
            const walletId = req.body.bookingData.walletId;
            const available = await bookSchema.findOne(
                { _id: bookId },
                { copies: { $elemMatch: { available: true } } }
            );
            const copyId = available.copies[0]._id
            const order = new orderSchema({
                userId: userId,
                bookId: bookId,
                totalAmount: totalAmount,
                copyId: copyId,
                totalDays: totalDays,
                bookedTimePeriod: bookedTimePeriod,
                address: address,
                walletId: walletId,
                paymentType: paymentType
            });
            await order.save();
            console.log('Booking saved successfully');
            await bookSchema.updateOne(
                { _id: bookId, "copies._id": copyId },
                { $set: { "copies.$.available": false } }
            );
            const book = await bookSchema.findOneAndUpdate({ _id: bookId }, { $inc: { quantity: -1 }, $push: { bookedTimePeriod: bookedTimePeriod } })
            await book.save();

            walletSchema.findByIdAndUpdate(walletId, {
                $inc: { walletAmount: -totalAmount }, $push: {
                    walletHistory: {
                        transactionType: 'Book order transaction',
                        amountDeducted: totalAmount
                    }
                }
            }, { new: true }).then(() => {
                res.status(200).json('order successful')
            }).catch((err) => {
                console.log('error occured while processing order with wallet');
                res.status(500).json('order failed with wallet')
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }

}