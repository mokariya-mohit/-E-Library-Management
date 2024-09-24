const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Error adding book' });
    }
};

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving books' });
    }
};

// Update a book by ID
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Error updating book' });
    }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting book' });
    }
};
// Borrow a book
exports.borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const userId = req.user.id;


        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the book is already borrowed
        if (book.borrowedBy) {
            return res.status(400).json({ message: 'Book is already borrowed' });
        }

        // Borrow the book
        book.borrowedBy = userId;
        book.available = false;
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully', book });
    } catch (err) {
        console.error(err); // Log the error to the server console
        res.status(500).json({ error: 'Error borrowing the book' });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const userId = req.user.id;

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Ensure borrowedBy is not null before checking
        if (book.borrowedBy && book.borrowedBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You did not borrow this book' });
        }

        // Return the book
        book.borrowedBy = null;
        book.available = true;
        await book.save();

        res.status(200).json({ message: 'Book returned successfully', book });
    } catch (err) {
        console.error(err); // Log the error to the server console
        res.status(500).json({ error: 'Error returning the book' });
    }
};
