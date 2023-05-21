const userSchema = require('../../models/Users/userSchema')
const generateToken = require('../../utils/generateToken')

exports.viewProfile = (req, res) => {
    try {
        let userId = req.query.id;
        userSchema.findOne({ _id: userId }).then((userData) => {
            res.status(200).json(userData);
        })
    } catch (err) {
        console.log(err, "Error in fetching user data");
        res.status(400).json({ message: 'Error in fetching user data' })
    }
}

exports.imageUpdate = (req, res) => {
    try {
        userSchema.updateOne({ _id: req.query.id }, { $set: { photo: req.body.image } }).then((result) => {
            userSchema.findOne({ _id: req.query.id }).then((data) => {
                console.log('user data updated');
                const { id, firstName, lastName, email, status, phone, photo } = data;
                let result = { id, firstName, lastName, email, status, phone, photo, token: generateToken(req.query.id) }
                console.log(result, 'updated data');
                res.status(200).json(result);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
}