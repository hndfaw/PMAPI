const programsData = require('../data/programs');
const projectsData = require('../data/projects');


const createProgram = (knex, program) => {
  return knex('programs').insert({
    name: program.name,
    beneficiaries: program.beneficiaries,
    budget: program.budget,
  }, 'id')
  .then(programId => {

    let projectsPromises = [];
    projectsData.forEach(project => {

      if ((project.programId + 227)  == programId) {
       projectsPromises.push(
         createProject(knex, {
           name: project.name,
           status: project.status,
           beneficiaries: project.beneficiaries,
           budget: project.budget,
           program_id: programId[0]
         })
       )
      }
     });

    return Promise.all(projectsPromises);
  })
};

const createProject = (knex, project) => {
  return knex('projects').insert(project);
};

exports.seed = (knex) => {
  return knex('projects').del()
    .then(() => knex('programs').del())
    .then(() => {
      let programsPromises = [];

      programsData.forEach(program => {
        programsPromises.push(createProgram(knex, program));
      });

      return Promise.all(programsPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

//////////

// const programsData = [
//   {
//     programId: 1,
//     name: 'IDCN',
//     beneficiaries: 5000,
//     budget: 1000000,
//     projects: [
//       {
//         id: 1,
//         programId: 1,
//         name: 'Agriculture stuff',
//         status: 'Completed',
//         beneficiaries: 120,
//         budget: 30000,
//       },
//       {
//         id: 2,
//         programId: 1,
//         name: 'Agriculture stuff 2',
//         status: 'Ongoing',
//         beneficiaries: 220,
//         budget: 50000,
//       }
//     ]
//   },
//   {
//     programId: 2,
//     name: 'PCD',
//     beneficiaries: 10000,
//     budget: 1500000,
//     projects: [
//       {
//         id: 3,
//         programId: 2,
//         name: 'Shelter kits',
//         status: 'Ongoing',
//         beneficiaries: 520,
//         budget: 150000,
//       }
//     ]
//   }
// ]

// const createProgram = (knex, program) => {
//   return knex('programs').insert({
//     name: program.name,
//     beneficiaries: program.beneficiaries,
//     budget: program.budget,
//   }, 'id')
//   .then(programId => {

//     let projectsPromises = [];

//     program.projects.forEach(project => {

//        projectsPromises.push(
//          createProject(knex, {
//            name: project.name,
//            status: project.status,
//            beneficiaries: project.beneficiaries,
//            budget: project.budget,
//            program_id: programId[0]
//          })
//        )
      
//      });


//     return Promise.all(projectsPromises);
//   })
// };

// const createProject = (knex, project) => {
//   return knex('projects').insert(project);
// };

// exports.seed = (knex) => {
//   return knex('projects').del()
//     .then(() => knex('programs').del())
//     .then(() => {
//       let programsPromises = [];

//       programsData.forEach(program => {
//         programsPromises.push(createProgram(knex, program));
//       });

//       return Promise.all(programsPromises);
//     })
//     .catch(error => console.log(`Error seeding data: ${error}`));
// };

