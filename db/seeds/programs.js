const programsData2 = require('../data/programs');
const projectsData = require('../data/projects');

const processedData = () => {
  const data = [];
  programsData2.forEach(program => {
    const projects = [],
   prosProgram = {
      ...program,
      projects,
    }
    projectsData.forEach(project => {
      if (program.programId === project.programId) {
        projects.push(project)
      }
    })
    data.push(prosProgram)
  })
  return data;
}

const programsData = processedData()

const createProgram = (knex, program) => {
  console.log(programsData)
  return knex('programs').insert({
    name: program.name,
    beneficiaries: program.beneficiaries,
    budget: program.budget,
  }, 'id')
  .then(programId => {

    let projectsPromises = [];
    program.projects.forEach(project => {

       projectsPromises.push(
         createProject(knex, {
           name: project.name,
           status: project.status,
           beneficiaries: project.beneficiaries,
           budget: project.budget,
           program_id: programId[0]
         })
       )
      
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