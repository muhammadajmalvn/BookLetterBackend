const bookSchema = require('../../models/Books/bookSchema')
const path = require('path')
const upload = require("../../utils/multer")
const fs = require('fs')
const cloudinary = require('../../utils/cloudinary')
const { v4: uuidv4 } = require('uuid');
const { title } = require('process')


exports.addBook = async (req, res) => {

    try {
        const uploader = async (path) => await cloudinary.uploads(path, 'Images')
        if (req.method === 'POST') {
            const urls = []
            const files = req.files

            for (const file of files) {
                const { path } = file
                const newPath = await uploader(path)
                const url = newPath.url
                urls.push(url)
                fs.unlinkSync(path)
            }


            let photo = []

            for (let i = 0; i < urls.length; i++) {
                photo.push(urls[i])
            }

            let books = await bookSchema.findOne({ title: req.body.title })
            console.log(books, 'copy found');
            if (books) {
                const copy = {
                    id: uuidv4(),
                    available: true
                }
                bookSchema.updateOne({ title: req.body.title }, { $inc: { quantity: 1 }, $push: { copies: copy } }).then((data) => {
                    res.status(200).json(data)
                })
            }
            else {
                const copies = {
                    id: uuidv4(),
                    available: true
                }

                let bookDetails = {
                    title: req.body.title,
                    author: req.body.author,
                    publisher: req.body.publisher,
                    price: req.body.price,
                    genre: req.body.genre,
                    pages: req.body.pages,
                    publishedDate: req.body.date,
                    description: req.body.description,
                    copies: copies,
                    photo

                }
                console.log(bookDetails, 'hfhfhfffh');

                bookSchema.create(bookDetails).then((data) => {
                    console.log('book data', data);
                    res.status(200).json(data)
                })
            }

        } else {
            res.status(405).json({
                error: `${req.method} method is not allowed`
            })
        }
    } catch (error) {
        console.log('cloudinary error occured', error);
    }
}

exports.getAllBooks = async (req, res) => {
    try {
        bookSchema.find().then((data) => {
            res.status(200).json(data)
        })
    }
    catch (error) {
        console.log(err, 'Error in fetching books');
        res.status(500).json(err)
    }
}

exports.deleteBook = async (req, res) => {
    try {
        await bookSchema.updateOne({ _id: req.query.id }, { $set: { isDeleted: true } })
        const data = await bookSchema.find()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json('Internal Server Error')
    }
}

exports.editBook = async (req, res) => {
    console.log(req.query.id, 'reached server ');
    try {
        const uploader = async (path) => await cloudinary.uploads(path, 'Images')

        if (req.method === 'POST') {
            const urls = []
            const files = req.files

            for (const file of files) {
                const { path } = file

                const newPath = await uploader(path)
                urls.push(newPath)
                fs.unlinkSync(path)
            }

            if (urls.length > 0) {
                console.log("Urls", urls);

                let photo = []

                for (let i = 0; i < urls.length; i++) {
                    photo.push(urls[i].url)
                    console.log(urls[i].url, 'url for the add bike');
                }


                bookSchema.updateOne(
                    { _id: req.query.id },
                    {
                        $set: {
                            title: req.body.title,
                            author: req.body.author,
                            publisher: req.body.publisher,
                            price: req.body.price,
                            genre: req.body.genre,
                            pages: req.body.pages,
                            publishedDate: req.body.date,
                            description: req.body.description,
                            // copies: copies,
                            photo
                        }
                    }
                ).then(() => {
                    bookSchema.findOne({ _id: req.query.id })
                })
            } else {

                const newURLS = req.body.imageUrl.split(",")

                bookSchema.updateOne(
                    { _id: req.query.id },
                    {
                        $set: {
                            title: req.body.title,
                            author: req.body.author,
                            publisher: req.body.publisher,
                            price: req.body.price,
                            genre: req.body.genre,
                            pages: req.body.pages,
                            publishedDate: req.body.date,
                            description: req.body.description,
                            // copies: copies,
                            photo: newURLS
                        }
                    }
                ).then((data) => {
                    bookSchema.findOne({ _id: req.query.id })
                    res.status(200).json(data);
                })
            }
        }
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json(error);
    }
}