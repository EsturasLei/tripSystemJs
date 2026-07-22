const pool = require('../db/db');

class DriverRepository {
    static async create(name, licenseNumber) {
        const query = `
        INSERT INTO drivers (name, license_number)
        VALUES ($1, $2)
        RETURNING *; 
        `;
        const result = await pool.query(query, [name, licenseNumber]);
        return result.rows[0];
    }

    static async findAll() {
        const query = `SELECT * FROM drivers ORDER BY id DESC;`;
        const result = await pool.query(query);
        return result.rows; 
    }
    static async update(id,name,licenseNumber){
        const result = await pool.query(
            'UPDATE drivers SET name = $1, license_number = $2 WHERE id = $3 RETURNING *',
            [name, licenseNumber, id]
        );
        return result.rows[0];
    }
    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM drivers WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
    static async delete(id){    
        const result = await pool.query(
            'DELETE FROM drivers WHERE id = $1 RETURNING *', 
            [id]
        );
        return result.rows[0];
    }

}

console.log("pool check", pool);

module.exports = DriverRepository;  