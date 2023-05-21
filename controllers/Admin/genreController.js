const genreSchema = require('../../models/Genres/genreSchema')
const bookSchema = require('../../models/Books/bookSchema')

exports.addGenre = async (req, res) => {
    const name = req.body.genre;
    try {
        genreSchema.find({ name: name }).then((genre) => {
            if (genre.length > 0) {
                console.log('Genre already exists');
                res.status(500).json("Genre Already Exists")
            } else {
                genreSchema.create({ name }).then((result) => {
                    res.status(201).json(result)
                }).catch((err) => {
                    res.status(400).json("Error", err)
                })
            }
        })
    }
    catch (error) {
        console.log(err);
        res.status(500).json(error.message)
    }
};

exports.getAllGenres = async (req, res) => {
    try {
        const data = await genreSchema.find()
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json(error)
    }
}


exports.deleteGenre = async (req, res) => {
    try {
        const genre = await genreSchema.findOne({ _id: req.query.id })
        console.log(genre);
        await genre.updateOne({ $set: { isDeleted: true } })
        await bookSchema.updateMany({ genre: genre.name }, { $set: { isDeleted: true } })
        const data = await genreSchema.find()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json('Internal Server Error')
    }
}