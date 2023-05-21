const userSchema = require('../../models/Users/userSchema')
const bcrypt = require('bcryptjs')
const generateToken = require('../../utils/generateToken')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASS,
    }
})
//SIGNUP POST CONTROLLER
exports.signupPost = async (req, res) => {
    try {
        let details = {
            firstName, lastName, email, phone, password
        } = req.body

        details.password = await bcrypt.hash(req.body.password, 10)

        userSchema.findOne({ email: details.email }).then((userData) => {
            if (userData) {
                console.log("user already exists");
                res.status(400).json("User Already Exists")
            } else {
                userSchema.create(details).then((result) => {
                    let details = {
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: result.email,
                    }
                    res.status(201).json(details)
                    console.log(result);
                }).catch((err) => {
                    res.status(400)
                    console.log("Error", err);
                })
            }
        })
    } catch (error) {
        res.json(error.message)
    }
}


//LOGIN POST CONTROLLER
exports.loginPost = (req, res) => {
    try {
        userSchema.findOne({ email: req.body.email }).then((userData) => {
            if (userData) {
                if (userData.status) {
                    bcrypt.compare(req.body.password, userData.password, function (err, response) {
                        if (response) {
                            let details = {
                                id: userData.id,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email,
                                phone: userData.phone,
                                token: generateToken(userData.id),
                                photo: userData.photo,
                                address: userData.address
                            }
                            res.status(200).json(details)
                        } else {
                            res.status(401).json("Incorrect Password")
                        }
                    })
                } else {
                    res.status(401).json("User is Blocked")
                }
            } else {
                res.status(400).json("User Does Not Exist")
            }
        })
    } catch (err) {
        console.log("Error: " + err);
    }
}

exports.otpLoginPost = async (req, res) => {
    try {
        let user = await userSchema.findOne({ phone: req.body.phone })
        if (user == null) {
            res.status(400).json("User not found with phone number")
        }
        else if (user.status) {
            const { id, firstName, lastName, email, status, phone, photo } = user

            const result = {
                id,
                firstName,
                lastName,
                email,
                phone,
                photo,
                status,
                token: generateToken(id)
            }
            console.log(result, 'result otp');

            res.status(200).json(result)
        }
        else {
            res.json(400).json("Account suspended Temporarily")

        }
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
}


// send email Link For reset Password
exports.sendEmailLink = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(401).json({ status: 401, message: 'Enter a valid email address' })
    }
    try {
        const userExists = await userSchema.findOne({ email: email });
        if (!userExists) {
            res.status(401).json({ status: 401, message: 'Invalid user' });
        }
        const token = jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "120s"
        });

        const setusertoken = await userSchema.findByIdAndUpdate({ _id: userExists._id }, { verifytoken: token }, { new: true });
        if (setusertoken) {
            const mailOptions = {
                from: process.env.NODEMAIL_USER,
                to: email,
                subject: "Sending email For password Reset",
                text: `This Link Valid For 2 MINUTES https://bookletter.netlify.app/forgotpassword/${userExists.id}/${setusertoken.verifytoken}`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "email not send" })
                } else {
                    console.log("Email sent", info.response);
                    res.status(201).json({ status: 201, message: "Email sent Successfully" })
                }
            })

        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
    }
}

// verify user for forgot password time
exports.verifyUser = async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await userSchema.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log(verifyToken)

        if (validuser && verifyToken._id) {
            res.status(201).json({ status: 201, validuser })
        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
}


// change password
exports.changePassword = async (req, res) => {
    const { id, token } = req.params;

    const { password } = req.body;

    try {
        const validuser = await userSchema.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (validuser && verifyToken._id) {
            const newpassword = await bcrypt.hash(password, 10);

            const setnewuserpass = await userSchema.findByIdAndUpdate({ _id: id }, { password: newpassword });

            setnewuserpass.save();
            res.status(201).json({ status: 201, setnewuserpass })

        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }
    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
}
