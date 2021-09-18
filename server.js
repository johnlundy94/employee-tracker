const inquirer = require("inquirer");
const mysql = require("mysql2");
const util = require("util");
require("console.table");
require("dotenv").config();

db.query = util.promisify(db.query);
db.connect((err) => {
  if (err) {
    throw err;
  }
});

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "menu",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee",
        ],
      },
    ])
    .then((userChoice) => {
      switch (userChoice.menu) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee":
          updateRole();
          break;
        default:
          process.exit();
      }
    });
}

async function viewDepartments() {
  try {
    const departments = await db.query("SELECT * FROM department");
    console.table(departments);
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function viewRoles() {
  try {
    const roles = await db.query("SELECT * FROM role");
    console.table(roles);
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function viewEmployees() {
  try {
    const employees = await db.query("SELECT * FROM employee");
    console.table(employees);
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "Add a department.",
        name: "department_name",
      },
    ]);
    await db.query("INSERT INTO department (department_name) VALUES (?);", [
      answers.department_name,
    ]);
    console.log("Department Added");
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function addRole() {
  try {
    let allDepartments = await db.query("SELECT * FROM department");
    let departmentChoices = allDepartments.map((department) => {
      return {
        name: `${department.department_name}`,
        value: department.id,
      };
    });
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "title",
      },
      {
        type: "input",
        message: "What is the salary for the role?",
        name: "salary",
      },
      {
        type: "list",
        message: "Which department does this role belong to?",
        name: "department_id",
        choices: departmentChoices,
      },
    ]);
    await db.query(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
      [answers.title, answers.salary, answers.department_id]
    );
    console.log("Role Added");
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function addEmployee() {
  try {
    let allRoles = await db.query("SELECT * FROM role");
    let roleChoices = allRoles.map((role) => {
      return {
        name: `${role.title}`,
        value: role.id,
      };
    });
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "input",
        message: "Who is the employee's manager",
        name: "manager_name",
      },
      {
        type: "list",
        message: "What role does this employee have.",
        name: "role_id",
        choices: roleChoices,
      },
    ]);
    await db.query(
      "INSERT INTO employee (first_name, last_name, manager_name, role_id) VALUES (?, ?, ?, ?);",
      [
        answers.first_name,
        answers.last_name,
        answers.manager_name,
        answers.role_id,
      ]
    );
    console.log("Employee Added");
  } catch (err) {
    console.log(err);
  }
  menu();
}

async function updateRole() {
  try {
    let allEmployees = await db.query("Select * FROM employee");
    let allRoles = await db.query("Select * FROM role");
    let employeeChoices = allEmployees.map((person) => {
      return {
        name: `${person.first_name} ${person.last_name}`,
        value: person.id,
      };
    });
    let rolesChoices = allRoles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        name: "employee_id",
        choices: employeeChoices,
      },
      {
        type: "list",
        message: "What role would you like to update?",
        name: "role_id",
        choices: rolesChoices,
      },
    ]);
    await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
      answers.role_id,
      answers.employee_id,
    ]);
    console.log("Role Updated");
  } catch (err) {
    console.log(err);
  }
  menu();
}
menu();
