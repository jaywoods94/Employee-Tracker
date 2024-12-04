const inquirer = require('inquirer');
const pool = require('./config/connection');
require('console.table');

const mainMenuQuestions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'View Employees by Manager',
            'View Employees by Department',
            'Delete Department',
            'Delete Role',
            'Delete Employee',
            'View Department Budget',
            'Quit'
        ]
    }
];

// Function to start the application
async function init() {
    try {
        const answers = await inquirer.prompt(mainMenuQuestions);
        
        switch (answers.action) {
            case 'View All Employees':
                await viewAllEmployees();
                break;
            case 'Add Employee':
                await addEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRole();
                break;
            case 'View All Roles':
                await viewAllRoles();
                break;
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'Quit':
                await pool.end();
                console.log('Goodbye!');
                process.exit();
            default:
                console.log('Feature coming soon!');
                init();
        }
    } catch (err) {
        console.error('Error:', err);
        init();
    }
}

// Function to view all employees
async function viewAllEmployees() {
    try {
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
        `;
        const { rows } = await pool.query(query);
        console.table(rows);
        init();
    } catch (err) {
        console.error('Error viewing employees:', err);
        init();
    }
}

// Function to view all roles
async function viewAllRoles() {
    try {
        const query = `
            SELECT r.id, r.title, d.name AS department, r.salary
            FROM role r
            JOIN department d ON r.department_id = d.id
        `;
        const { rows } = await pool.query(query);
        console.table(rows);
        init();
    } catch (err) {
        console.error('Error viewing roles:', err);
        init();
    }
}

// Function to view all departments
async function viewAllDepartments() {
    try {
        const query = 'SELECT * FROM department';
        const { rows } = await pool.query(query);
        console.table(rows);
        init();
    } catch (err) {
        console.error('Error viewing departments:', err);
        init();
    }
}

// Function to add an employee
async function addEmployee() {
    try {
        // Get roles
        const { rows: roles } = await pool.query('SELECT id, title FROM role');
        // Get employees for manager selection
        const { rows: managers } = await pool.query(
            'SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee'
        );

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: [
                    { name: 'None', value: null },
                    ...managers.map(manager => ({
                        name: manager.name,
                        value: manager.id
                    }))
                ]
            }
        ]);

        await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [answers.firstName, answers.lastName, answers.roleId, answers.managerId]
        );

        console.log('Employee added successfully!');
        init();
    } catch (err) {
        console.error('Error adding employee:', err);
        init();
    }
}

// Function to add a department
async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ]);

        await pool.query(
            'INSERT INTO department (name) VALUES ($1)',
            [answer.name]
        );

        console.log('Department added successfully!');
        init();
    } catch (err) {
        console.error('Error adding department:', err);
        init();
    }
}

// Start the application
init().catch(console.error);