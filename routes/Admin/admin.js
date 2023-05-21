const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/Admin/loginController')
const userController = require('../../controllers/Admin/userController');
const bookController = require('../../controllers/Admin/bookController');
const genreController = require('../../controllers/Admin/genreController');
const ordersController = require('../../controllers/Admin/ordersController');
const sellController = require('../../controllers/Admin/sellController');
const dashboardController = require('../../controllers/Admin/dashboardController');
const { protect } = require('../../Middlewares/verifyToken')
const upload = require('../../utils/multer');
const salesReportController = require('../../controllers/Admin/salesReportController');

//login admin
router.post('/', loginController.adminLogin)

router.route('/user-search',).post(protect, userController.searchUser)
router.route('/add-genre').post(protect, genreController.addGenre)
router.route('/order-status').post(protect, ordersController.changeOrderStatus)
// users
router.route('/users')
    .get(protect, userController.getUsers)
    .delete(protect, userController.deleteUser)
router.route('/manage-users').get(userController.blockUnblockUser)

// books view and delete books
router.route('/books')
    .get(protect, bookController.getAllBooks)
    .delete(protect, bookController.deleteBook)

//books add and edit
router.route('/add-books').post(upload.array('images'), protect, bookController.addBook)
router.route('/edit-book').post(upload.array('images'), protect, bookController.editBook)

//genres
router.route('/genres')
    .get(protect, genreController.getAllGenres)
router.route('/delete-genre').get(protect, genreController.deleteGenre)

//orders
router.route('/orders').get(protect, ordersController.getAllOrders)

//returns
router.route('/returns')
    .get(protect, ordersController.getReturns)
    .put(protect, ordersController.acceptReturns)

// sell books
router.route('/sell')
    .get(protect, sellController.getSellRequests)
    .post(protect, sellController.changeStatus)

//Dashboard
router.route('/dashboard').get(protect, dashboardController.getDashboardDetails)

//sales report
router.route('/sales-report').get(protect, salesReportController.getSalesReportDetails)
module.exports = router;


