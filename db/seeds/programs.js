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

      if ((project.programId + 211) == programId) {
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



