const express = require("express");
const booksController = require("./controllers/bookController");
const mysql = require("mysql2/promise");
const dbConfig = require("./dbConfig");
const validateBook = require("./middlewares/validateBook");
const usersController = require('./controllers/usersController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data handling
app.use(express.static("public")); // Serve static files

// Routes
app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);
app.post("/books", validateBook, booksController.createBook);
app.put("/books/:id", validateBook, booksController.updateBook);
app.delete("/books/:id", booksController.deleteBook);

// Additional Routes (User)

app.post('/users', usersController.createUser);
app.get('/users', usersController.getAllUsers);
app.get('/users/:id', usersController.getUserById);
app.put('/users/:id', usersController.updateUser);
app.delete('/users/:id', usersController.deleteUser);
// Practical 4
app.get("/users/search", usersController.searchUsers);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
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
