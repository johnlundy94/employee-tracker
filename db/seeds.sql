INSERT INTO department (department_name)
VALUES  ('Sales'),
        ('Human Resources'),
        ('Business');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Lead', 60000, 1),
        ('Sales Rep', 45000, 1),
        ('Human Resource Manager', 40000, 2),
        ('Bookkeeping', 100000, 3);

INSERT INTO employee (role_id, first_name, last_name) VALUES 
      (1, "Dean", "Evans"),
       (2, "James", "Arthur"),
       (3, "Stephanie", "Stevens"),
       (4, "Paul", "Romone");