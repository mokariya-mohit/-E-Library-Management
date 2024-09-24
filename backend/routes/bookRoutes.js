const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.post('/books', bookController.createBook);
router.get('/books', bookController.getBooks);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

// Borrow and return book routes
router.put('/books/:id/borrow', verifyToken, bookController.borrowBook);
router.put('/books/:id/return', verifyToken, bookController.returnBook);

module.exports = router;
