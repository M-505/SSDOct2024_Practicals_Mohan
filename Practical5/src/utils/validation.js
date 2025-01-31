const { body, param, query } = require('express-validator');

const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .isIn(['student', 'librarian'])
        .withMessage('Role must be either student or librarian')
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
];

const bookValidation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title is required and must not exceed 255 characters'),
    body('author')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Author is required and must not exceed 100 characters'),
    body('isbn')
        .trim()
        .matches(/^[\d-]{10,13}$/)
        .withMessage('Please provide a valid ISBN'),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category is required and must not exceed 50 characters'),
    body('totalCopies')
        .isInt({ min: 1 })
        .withMessage('Total copies must be at least 1')
];

const borrowValidation = [
    body('bookId')
        .isUUID()
        .withMessage('Invalid book ID'),
    body('dueDate')
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom(value => {
            const dueDate = new Date(value);
            const now = new Date();
            if (dueDate <= now) {
                throw new Error('Due date must be in the future');
            }
            return true;
        })
];