class User {
    static async createUser(user) {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
          `INSERT INTO Users (username, email) VALUES (?, ?)`,
          [user.username, user.email]
        );
        await connection.end();
        return { id: result.insertId, ...user };
      } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
    }
  
    static async getAllUsers() {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`SELECT * FROM Users`);
        await connection.end();
        return rows;
      } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }
    }
  
    static async getUserById(id) {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`SELECT * FROM Users WHERE id = ?`, [id]);
        await connection.end();
        return rows[0] || null;
      } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }
    }
  
    static async updateUser(id, updatedUser) {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
          `UPDATE Users SET username = ?, email = ? WHERE id = ?`,
          [updatedUser.username, updatedUser.email, id]
        );
        await connection.end();
        return result.affectedRows > 0;
      } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
      }
    }
  
    static async deleteUser(id) {
      try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`DELETE FROM Users WHERE id = ?`, [id]);
        await connection.end();
        return result.affectedRows > 0;
      } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
      }
    }

    static async searchUsers(searchTerm) {
        const connection = await mysql.createConnection(dbConfig);
    
        try {
          const query = `
            SELECT *
            FROM Users
            WHERE username LIKE ?
            OR email LIKE ?
          `;
          const [rows] = await connection.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
          return rows;
        } catch (error) {
          throw new Error(`Error searching users: ${error.message}`);
        } finally {
          await connection.end();
        }
      }
    }
  module.exports = User;  