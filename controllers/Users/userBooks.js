const bookSchema = require('../../models/Books/bookSchema')
const genreSchema = require('../../models/Genres/genreSchema')

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


exports.getGenreBooks = async (req, res) => {
    try {
        bookSchema.find({ genre: req.body.genre }).then((data) => {
            res.status(200).json(data)
        })
    }
    catch (error) {
        console.log(err, 'Error in fetching books');
        res.status(500).json(err)
    }
}


exports.searchBook = async (req, res) => {
    try {
        let username = req.body.searchTerm;
        console.log(username, '55555');
        bookSchema.find({
            $or: [
                { title: { $regex: ".*" + username + ".*", $options: "i" } },
                { author: { $regex: ".*" + username + ".*", $options: "i" } },
                { genre: { $regex: ".*" + username + ".*", $options: "i" } },
                { publisher: { $regex: ".*" + username + ".*", $options: "i" } },

            ]
        })
            .then((data) => {
                res.status(200).json(data);
                console.log(data);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    } catch (error) {
        res.status(400).json(error.message);
    }
};


exports.getAllGenres = async (req, res) => {
    try {
        genreSchema.find().then((data) => {
            res.status(200).json(data)
        })
    }
    catch (error) {
        res.status(500).json(error)
    }
}