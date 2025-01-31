// src/controllers/bookController.js
const { validationResult } = require('express-validator');
const { Book } = require('../models/book');

class BookController {
    static async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const book = await Book.create(req.body);
            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const { title, author, category, available } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const books = await Book.findAll({
                title,
                author,
                category,
                available: available === 'true',
                page,
                limit
            });

            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const book = await Book.update(req.params.id, req.body);
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await Book.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async search(req, res, next) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: 'Search query is required' });
            }

            const books = await Book.search(query);
            res.json(books);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BookController;    