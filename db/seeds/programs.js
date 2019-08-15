let programsData = [
  {
    name: 'AAA',
    beneficiaries: 10000,
    budget: 30000,
    projects: [{
      name: 'AAA Stuff',
      status: 'Completed',
      beneficiaries: 120,
      budget: 30000,
    }]
  },
  {
    name: 'BBB',
    beneficiaries: 10000,
    budget: 30000,
    projects: [
      {
        name: 'BBB Stuff',
        status: 'Completed',
        beneficiaries: 120,
        budget: 30000,
      },
      {
        name: 'BBB Stuff 2',
        status: 'Completed',
        beneficiaries: 120,
        budget: 30000,
      }
    ]
  },
  {
    name: 'CCC',
    beneficiaries: 10000,
    budget: 30000,
    projects: [
      {
        name: 'CCC Stuff',
        status: 'Completed',
        beneficiaries: 120,
        budget: 30000,
      },
      {
        name: 'CCC Stuff 2',
        status: 'Completed',
        beneficiaries: 120,
        budget: 30000,
      }
    ]
  }
];

const createProgram = (knex, program) => {
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



