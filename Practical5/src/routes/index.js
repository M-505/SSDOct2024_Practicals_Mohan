const express = require('express');
const { authRouter, bookRouter, borrowingRouter } = require('./routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/books', bookRouter);
router.use('/borrowings', borrowingRouter);

module.exports = router;
