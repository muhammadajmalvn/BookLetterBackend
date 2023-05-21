const sellRequestSchema = require('../../models/SellRequests/sellRequests')
const bookSchema = require('../../models/Books/bookSchema')
const walletSchema = require('../../models/Wallet/walletSchema')
const { v4: uuidv4 } = require('uuid');

exports.getSellRequests = async (req, res) => {
    try {
        const data = await sellRequestSchema.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json('error getting sell request')
    }
}


exports.changeStatus = async (req, res) => {
    console.log(req.body.status);
    try {
        await sellRequestSchema.updateOne({ _id: req.body.orderId }
            , {
                $set: { status: req.body.status },
                $push: {
                    statusHistory: {
                        status: req.body.status,
                        date: new Date()
                    }
                }
            })
        if (req.body.status === 'received') {
            const item = await sellRequestSchema.findById(req.body.orderId)
            const bookAlreadyExists = await bookSchema.findOne({ title: item.title })
            if (bookAlreadyExists) {
                const copy = {
                    id: uuidv4(),
                    available: true
                }
                bookSchema.updateOne({ title: item.title }, { $inc: { quantity: 1 }, $push: { copies: copy } }).then((data) => {
                    res.status(200).json(data)
                })
            } else {
                const copies = {
                    id: uuidv4(),
                    available: true
                }

                let bookDetails = {
                    title: item.title,
                    author: item.author,
                    publisher: item.publisher,
                    price: Math.floor(item.askingPrice / 100),
                    genre: item.genre,
                    pages: item.pages,
                    publishedDate: item.publishedDate,
                    copies: copies,
                    photo: item.photo,

                }
                console.log(bookDetails, 'hfhfhfffh');
                bookSchema
                    .updateOne({ title: item.title }, { $set: bookDetails }, { upsert: true })
                    .then((data) => {
                        console.log('book data', data);
                    });
            }
            let walletExists = await walletSchema.findOne({ userId: item.userId })
            if (!walletExists) {
                const newWallet = {
                    userId: item.userId,
                    walletAmount: item.askingPrice,
                    walletHistory: [{
                        transactionType: 'Book sell transaction',
                        amountAdded: item.askingPrice
                    }]
                }
                walletSchema.create(newWallet)
            } else {
                const kitti = await walletSchema.findOne({ userId: walletExists.userId })
                await walletSchema.updateOne({ userId: walletExists.userId }, {
                    $inc: { walletAmount: item.askingPrice }, $push: {
                        walletHistory: {
                            transactionType: 'Book sell transaction',
                            amountAdded: item.askingPrice
                        }
                    }
                })
            }
            res.status(200).json('Book received')
        } else {
            res.status(200).json('Updated order status')
        }
    } catch (e) {
        res.status(500).json("Error updating")
    }
}
