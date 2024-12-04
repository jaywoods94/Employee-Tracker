const { Pool } = require('pg');

class EmployeeDB {
    constructor(connectionConfig) {
        this.pool = new Pool(connectionConfig);
    }

    // Basic CRUD Operations
    async getAllEmployees() {
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY e.id;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getAllRoles() {
        const query = `
            SELECT r.id, r.title, r.salary, d.name AS department
            FROM role r
            JOIN department d ON r.department_id = d.id
            ORDER BY r.id;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getAllDepartments() {
        const query = `
            SELECT id, name
            FROM department
            ORDER BY id;
        `;
        const result = await this.pool.query(query);
        return result.rows;
    }

    // Bonus Features
    async getEmployeesByManager(managerId) {
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            WHERE e.manager_id = $1
            ORDER BY e.last_name, e.first_name;
        `;
        const result = await this.pool.query(query, [managerId]);
        return result.rows;
    }

    async getEmployeesByDepartment(departmentId) {
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            JOIN role r ON e.role_id = r.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE r.department_id = $1
            ORDER BY e.last_name, e.first_name;
        `;
        const result = await this.pool.query(query, [departmentId]);
        return result.rows;
    }

    async updateEmployeeManager(employeeId, newManagerId) {
        const query = `
            UPDATE employee
            SET manager_id = $2
            WHERE id = $1
            RETURNING *;
        `;
        const result = await this.pool.query(query, [employeeId, newManagerId]);
        return result.rows[0];
    }

    async getDepartmentBudget(departmentId) {
        const query = `
            SELECT 
                d.name AS department,
                SUM(r.salary) AS total_budget
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            WHERE d.id = $1
            GROUP BY d.name;
        `;
        const result = await this.pool.query(query, [departmentId]);
        return result.rows[0];
    }

    // Delete operations
    async deleteDepartment(id) {
        const query = 'DELETE FROM department WHERE id = $1 RETURNING *;';
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async deleteRole(id) {
        const query = 'DELETE FROM role WHERE id = $1 RETURNING *;';
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async deleteEmployee(id) {
        const query = 'DELETE FROM employee WHERE id = $1 RETURNING *;';
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    // Clean up
    async close() {
        await this.pool.end();
    }
}

module.exports = EmployeeDB;