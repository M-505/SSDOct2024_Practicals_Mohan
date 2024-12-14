const express = require('express');
const bodyParser = require("body-parser");

const app = express();

const port = 3000;

let books = [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
 ];

 // parse incoming JSON data in requests
app.use(express.json())
// Configure body-parser to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true })); // Set extended: true for nested objects

app.get('/books', (req, res) => {
    res.json(books); // Send the array of books as JSON response
 });