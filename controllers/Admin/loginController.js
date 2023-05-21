const generateToken = require('../../utils/generateToken')
const bcrypt = require('bcryptjs')
const adminSchema = require('../../models/Admin/adminSchema')

exports.adminLogin = (req, res) => {
    console.log(req.body);
    try {
       adminSchema.findOne({ email: req.body.email }).then((adminData) => {
            if (adminData) {
                bcrypt.compare(req.body.password, adminData.password, function (err, response) {
                    if (response) {
                        let details = {
                            email: adminData.email,
                            token: generateToken(adminData.id)
                        }
                        console.log(details, 'details of admin');
                        res.status(200).json(details)
                    } else {
                        res.status(401).json("Incorrect Password")
                        console.log("Incorrect Password");
                    }
                })

            } else {
                res.status(400).json("Invalid Admin")
                console.log("Invalid Admin");
            }
        })
    } catch (err) {
        console.log("Error: " + err);
    }
}
