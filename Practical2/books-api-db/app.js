const express = require("express");
const booksController = require("./controllers/bookController");
const mysql = require("mysql2/promise");
const dbConfig = require("./dbConfig");
const validateBook = require("./middlewares/validateBook");

const app = express();
const port = process.env.PORT || 3000;

// Add middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);
// Additional Methods
app.post("/books", validateBook, booksController.createBook);
app.put("/books/:id", validateBook, booksController.updateBook);  // Added validation middleware
app.delete("/books/:id", booksController.deleteBook);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// Initialize database connection pool
let connection;
const initDatabase = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Database connection established successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    initDatabase();
});

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    if (connection) {
        try {
            await connection.end();
            console.log("Database connection closed");
        } catch (err) {
            console.error("Error closing database connection:", err);
        }
    }
    process.exit(0);
});