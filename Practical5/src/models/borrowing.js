class Borrowing {
    static async create(userId, bookId, dueDate) {
        const id = uuidv4();

        return Database.transaction(async (connection) => {
            // Check if book is available
            const [book] = await connection.execute(
                'SELECT available_copies FROM books WHERE id = ? FOR UPDATE',
                [bookId]
            );

            if (!book || book[0].available_copies <= 0) {
                throw new Error('Book is not available for borrowing');
            }

            // Create borrowing record
            await connection.execute(
                `INSERT INTO borrowings (id, user_id, book_id, due_date) 
                VALUES (?, ?, ?, ?)`,
                [id, userId, bookId, dueDate]
            );

            // Update book available copies
            await connection.execute(
                'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
                [bookId]
            );

            // Get the created borrowing with book details
            const sql = `
                SELECT 
                    b.*, 
                    bk.title as book_title,
                    bk.author as book_author
                FROM borrowings b
                JOIN books bk ON b.book_id = bk.id
                WHERE b.id = ?
            `;
            
            const [result] = await connection.execute(sql, [id]);
            return result[0];
        });
    }

    static async findByUser(userId) {
        const sql = `
            SELECT 
                b.*,
                bk.title as book_title,
                bk.author as book_author
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            WHERE b.user_id = ?
            ORDER BY b.borrow_date DESC
        `;

        return Database.query(sql, [userId]);
    }

    static async return(id) {
        return Database.transaction(async (connection) => {
            // Get borrowing record
            const [borrowing] = await connection.execute(
                'SELECT * FROM borrowings WHERE id = ? AND returned = FALSE FOR UPDATE',
                [id]
            );

            if (!borrowing[0]) {
                throw new Error('Borrowing record not found or already returned');
            }

            // Update borrowing record
            await connection.execute(
                `UPDATE borrowings 
                SET returned = TRUE, 
                    return_date = CURRENT_TIMESTAMP 
                WHERE id = ?`,
                [id]
            );

            // Update book available copies
            await connection.execute(
                'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?',
                [borrowing[0].book_id]
            );

            // Get updated borrowing record with book details
            const sql = `
                SELECT 
                    b.*, 
                    bk.title as book_title,
                    bk.author as book_author
                FROM borrowings b
                JOIN books bk ON b.book_id = bk.id
                WHERE b.id = ?
            `;
            
            const [result] = await connection.execute(sql, [id]);
            return result[0];
        });
    }

    static async getOverdueBooks() {
        const sql = `
            SELECT 
                b.*,
                bk.title as book_title,
                bk.author as book_author,
                u.username as user_name,
                u.email as user_email,
                DATEDIFF(CURRENT_TIMESTAMP, b.due_date) as days_overdue
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            JOIN users u ON b.user_id = u.id
            WHERE b.returned = FALSE
            AND b.due_date < CURRENT_TIMESTAMP
            ORDER BY b.due_date ASC
        `;

        return Database.query(sql);
    }
}

module.exports = {
    Borrowing
};