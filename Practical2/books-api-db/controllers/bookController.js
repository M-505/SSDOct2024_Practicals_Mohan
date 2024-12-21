const Book = require("../models/book");

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books");
    }
};

const getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const book = await Book.getBookById(bookId);
        if (!book) {
            return res.status(404).send("Book not found");
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving book");
    }
};

const createBook = async (req, res) => {
    const newBook = req.body;
    try {
        const createdBook = await Book.createBook(newBook);
        res.status(201).json(createdBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating book");
    }
};

const updateBook = async (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookData = req.body;
    try {
        const existingBook = await Book.getBookById(bookId);
        if (!existingBook) {
            return res.status(404).send("Book not found");
        }
        const updatedBook = await Book.updateBook(bookId, bookData);
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book");
    }
};

// Add the deleteBook function
const deleteBook = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        // First check if book exists
        const existingBook = await Book.getBookById(bookId);
        if (!existingBook) {
            return res.status(404).send("Book not found");
        }
        
        // Delete the book
        await Book.deleteBook(bookId);
        res.status(200).json({ 
            message: "Book deleted successfully",
            id: bookId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting book");
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};