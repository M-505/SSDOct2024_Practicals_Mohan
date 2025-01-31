const { Borrowing } = require('../models/borrowing');

class BorrowingController {
    static async borrowBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { bookId, dueDate } = req.body;
            const userId = req.user.id;

            const borrowing = await Borrowing.create(userId, bookId, dueDate);
            res.status(201).json(borrowing);
        } catch (error) {
            next(error);
        }
    }

    static async returnBook(req, res, next) {
        try {
            const borrowing = await Borrowing.return(req.params.id);
            res.json(borrowing);
        } catch (error) {
            next(error);
        }
    }

    static async getUserBorrowings(req, res, next) {
        try {
            const borrowings = await Borrowing.findByUser(req.user.id);
            res.json(borrowings);
        } catch (error) {
            next(error);
        }
    }

    static async getOverdueBooks(req, res, next) {
        try {
            // Only librarians can see all overdue books
            if (req.user.role !== 'librarian') {
                return res.status(403).json({ 
                    error: 'Access denied. Librarian privileges required.' 
                });
            }

            const overdueBooks = await Borrowing.getOverdueBooks();
            res.json(overdueBooks);
        } catch (error) {
            next(error);
        }
    }

    static async getUserOverdueBooks(req, res, next) {
        try {
            const overdueBooks = await Borrowing.getOverdueBooks(req.user.id);
            res.json(overdueBooks);
        } catch (error) {
            next(error);
        }
    }
} 

module.exports = BorrowingController;    