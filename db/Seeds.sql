-- Seed data
INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales'),
    ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 85000, 1),
    ('Senior Engineer', 125000, 1),
    ('Finance Manager', 135000, 2),
    ('Accountant', 75000, 2),
    ('Legal Team Lead', 145000, 3),
    ('Lawyer', 115000, 3),
    ('Sales Manager', 95000, 4),
    ('Sales Representative', 65000, 4),
    ('Marketing Director', 105000, 5),
    ('Marketing Coordinator', 55000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 2, NULL),
    ('Jane', 'Smith', 1, 1),
    ('Mike', 'Wilson', 3, NULL),
    ('Sarah', 'Brown', 4, 3),
    ('Tom', 'Davis', 5, NULL),
    ('Lisa', 'Anderson', 6, 5),
    ('David', 'Miller', 7, NULL),
    ('Emma', 'Taylor', 8, 7),
    ('Chris', 'Martin', 9, NULL),
    ('Amy', 'White', 10, 9);