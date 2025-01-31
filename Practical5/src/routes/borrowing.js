const { BorrowingController } = require('../controllers/borrowingController');
const { borrowValidation } = require('../utils/validation');

const borrowingRouter = express.Router();

borrowingRouter.use(authenticateToken); // Protect all borrowing routes

// Student and Librarian routes
borrowingRouter.get('/my', BorrowingController.getUserBorrowings);
borrowingRouter.post('/', borrowValidation, BorrowingController.borrowBook);
borrowingRouter.put('/:id/return', BorrowingController.returnBook);
borrowingRouter.get('/my-overdue', BorrowingController.getUserOverdueBooks);

// Librarian only routes
borrowingRouter.get('/overdue', authorizeLibrarian, BorrowingController.getOverdueBooks);

module.exports = {
    authRouter: router,
    bookRouter,
    borrowingRouter
};