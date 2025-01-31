const { v4: uuidv4 } = require('uuid');
const Database = require('../config/database');

class Book {
    static async create({ title, author, isbn, category, totalCopies }) {
        const id = uuidv4();
        
        try {
            const sql = `
                INSERT INTO books (id, title, author, isbn, category, total_copies, available_copies)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            await Database.query(sql, [id, title, author, isbn, category, totalCopies, totalCopies]);
            return this.findById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('ISBN already exists');
            }
            throw error;
        }
    }

    static async findAll({ title, author, category, available, page = 1, limit = 10 }) {
        let sql = 'SELECT * FROM books WHERE 1=1';
        const params = [];

        if (title) {
            sql += ' AND title LIKE ?';
            params.push(`%${title}%`);
        }
        if (author) {
            sql += ' AND author LIKE ?';
            params.push(`%${author}%`);
        }
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (available) {
            sql += ' AND available_copies > 0';
        }

        // Add pagination
        const offset = (page - 1) * limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return Database.query(sql, params);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM books WHERE id = ?';
        const books = await Database.query(sql, [id]);
        return books[0];
    }

    static async update(id, { title, author, isbn, category, totalCopies }) {
        const book = await this.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }

        // Calculate new available copies
        const copiesDiff = totalCopies - book.totalCopies;
        const newAvailableCopies = book.availableCopies + copiesDiff;

        if (newAvailableCopies < 0) {
            throw new Error('Cannot reduce total copies below borrowed amount');
        }

        try {
            const sql = `
                UPDATE books 
                SET title = ?, 
                    author = ?, 
                    isbn = ?, 
                    category = ?, 
                    total_copies = ?,
                    available_copies = ?
                WHERE id = ?
            `;
            
            await Database.query(sql, [
                title, 
                author, 
                isbn, 
                category, 
                totalCopies,
                newAvailableCopies,
                id
            ]);

            return this.findById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('ISBN already exists');
            }
            throw error;
        }
    }

    static async delete(id) {
        const book = await this.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }

        if (book.totalCopies !== book.availableCopies) {
            throw new Error('Cannot delete book with borrowed copies');
        }

        const sql = 'DELETE FROM books WHERE id = ?';
        await Database.query(sql, [id]);
    }

    static async search(query) {
        const sql = `
            SELECT * FROM books 
            WHERE title LIKE ? 
            OR author LIKE ? 
            OR isbn LIKE ? 
            OR category LIKE ?
        `;
        const searchParam = `%${query}%`;
        return Database.query(sql, [searchParam, searchParam, searchParam, searchParam]);
    }
}
