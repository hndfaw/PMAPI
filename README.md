**Program Management API**

This is a Node.js application to use RESTful API. The app is built using Express, Knex, and PostgreSQL. The API consists of data for Humanitarian NGO programs; programs and projects.

[Go to website!](https://pmapi-node.herokuapp.com)

How to fetch data:

1. Get all programs data:

  `Path: https://pmapi-node.herokuapp.com/api/v1/programs`

2. Get data of one program:
  Requirements: `Program ID`.

  `Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id`

3. Get data of the projects of one program:
  Requirements: `Program ID`.

  `Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id/projects`

4. Get data of one project:
  Requirements:`Program ID` and `Project ID`.

  `Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id/projects/:projectId`

5. Post (Add) a new program:
  Requirements: `New program object`.
  *New Program Object* should have: `Name`, `Beneficiaries` and `Budget`.
  *New Program Object Example:*
  {
    "name": `<String>`,
    "beneficiaries": `<Number>`,
    "budget": `<Number>`
  }

  `Path: https://pmapi-node.herokuapp.com/api/v1/programs`


  6. Post (Add) a new project:
    Requirements: `Program ID` and `New project object`.
    *New Project Object* should have: `Name`, `Status`,`Beneficiaries` and `Budget`.
    *New Project Object Example:*
    {
      "name": `<String>`,
      "status": `<String>`,
      "beneficiaries": `<Number>`,
      "budget": `<Number>`
    }

    Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id

  7. Delete a project:
    Requirements: `Program ID` .

    Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id

  *Note* Deleting program will also delete all projects under that parogram!

  8. Delete a project:
    Requirements: `Program ID` and `Project ID`.

    Path: https://pmapi-node.herokuapp.com/api/v1/programs/:id/projects/projectId


* Note: all IDs in the path are Program IDs.
