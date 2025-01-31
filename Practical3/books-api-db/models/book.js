const mysql = require("mysql2/promise");  // Note: Using mysql2/promise
const dbConfig = require("../dbConfig");

class Book {
    constructor(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
    }

    static async getAllBooks() {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT * FROM Books');
            
            if (!rows || rows.length === 0) {
                console.log("No books found.");
                return [];
            }
            
            return rows.map(row => new Book(row.id, row.title, row.author));
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async getBookById(id) {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT * FROM Books WHERE id = ?', [id]);
            
            if (!rows || rows.length === 0) {
                return null;
            }
            
            return new Book(rows[0].id, rows[0].title, rows[0].author);
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async createBook(newBookData) {
      let connection;
      try {
          connection = await mysql.createConnection(dbConfig);
          
          const [result] = await connection.execute(
              'INSERT INTO Books (title, author) VALUES (?, ?)',
              [newBookData.title, newBookData.author]
          );
  
          // Get the ID of the newly inserted book
          const newBookId = result.insertId;
          
          // Return the newly created book
          return this.getBookById(newBookId);
      } catch (error) {
          console.error('Error creating book:', error);
          throw error;
      } finally {
          if (connection) {
              await connection.end();
          }
      }
  }

  static async deleteBook(id) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const [result] = await connection.execute(
            'DELETE FROM Books WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

  static async updateBook(id, bookData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const [result] = await connection.execute(
            'UPDATE Books SET title = ?, author = ? WHERE id = ?',
            [bookData.title, bookData.author, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        // Return the updated book
        return this.getBookById(id);
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
}
module.exports = Book;