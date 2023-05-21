const express = require('express');
const router = express.Router();
const userSignupLogin = require('../../controllers/Users/signup-login')
const { protect } = require('../../Middlewares/verifyToken')
const userProfile = require('../../controllers/Users/userProfile')
const userBooks = require('../../controllers/Users/userBooks')
const userBooking = require('../../controllers/Users/userBooking')
const userOrders = require('../../controllers/Users/userOrders')
const userSelling = require('../../controllers/Users/userSelling')
const upload = require('../../utils/multer');
const walletController = require('../../controllers/Users/walletController');
const chatContoller = require('../../controllers/Users/chatController');

router.post('/user-signup', userSignupLogin.signupPost)
router.post('/user-login', userSignupLogin.loginPost)
router.post('/otp-login', userSignupLogin.otpLoginPost)

router.route('/profile').get(protect, userProfile.viewProfile)
router.route('/profileImageUpdate').post(protect, userProfile.imageUpdate)

router.route('/books').get(userBooks.getAllBooks)
router.route('/genrebooks').post(userBooks.getGenreBooks)
router.route('/search-book').post(userBooks.searchBook)
router.route('/genres').get(userBooks.getAllGenres)

router.route('/booking-book').post(protect, userBooking.booking)
router.route('/orders').get(protect, userOrders.getOrders)
router.route('/return').post(protect, userOrders.returnOrder)

router.route('/add-address').post(protect, userOrders.addAddress)
router.route('/get-address').get(protect, userOrders.getAddress)

router.route('/sell-book').post(upload.array('images'), protect, userSelling.sellBook)
router.route('/sell-requests')
    .get(protect, userSelling.getSellBook)
    .post(protect, userSelling.sendAcceptedBook)

//wallet
router.route("/get-wallet").get(protect, walletController.getWalletController)

// chat
router.route("/contacts").get(protect, chatContoller.userContactController)
router.route("/add-message").post(protect, chatContoller.addMessageController)
router.route("/get-all-messages").post(protect, chatContoller.getAllMessageController)
router.route("/send-image").post(protect, chatContoller.sendImageController)

router.route('/sendpasswordlink').post(userSignupLogin.sendEmailLink)
router.route("/forgotpassword/:id/:token").get(userSignupLogin.verifyUser)
router.route("/forgotpassword/:id/:token").post(userSignupLogin.changePassword)
module.exports = router;