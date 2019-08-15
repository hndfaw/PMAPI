

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const cors = require('cors');
const app = express();




app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.locals.title = 'BYOB';

app.get('/', (request, response) => {
  response.send('This is PMAPI project');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

// GET

// get all programs

app.get('/api/v1/programs', (request, response) => {
  database('programs').select()
    .then(programs => {
      response.status(200).json(programs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});


// get one program by id

app.get('/api/v1/programs/:id', (request, response) => {
  const {id} = request.params
  database('programs').where('id', id).select()
    .then(program => {
      if(program.length) {
        response.status(200).json(program[0])
      } else {
        response.status(404).json({
          error: `Could not find program with id ${id}`
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
})


// get all projects of one program

app.get('/api/v1/programs/:id/projects', (request, response) => {
  const { id } = request.params

  database('programs').where('id', id).select()
  .then(program => {
    if(!program.length) {
      response.status(404).json({
        error: `Could not find program with id ${id}`
      })
    } else {
      database('projects').where('program_id', id).select()
        .then(projects => {
          if(projects.length) {
            response.status(200).json(projects);
          } else {
             response.status(404).json({
          error: `There are no projects under program with id ${id}`
        })
      }
  })
    .catch((error) => {
    response.status(500).json({ error });
  });
    }
  })

  
});


// get one project by id

app.get('/api/v1/programs/:id/projects/:projectId', (request, response) => {
  const { id, projectId } = request.params

  database('programs').where('id', id).select()
  .then(program => {
    if(!program.length) {
      response.status(404).json({
        error: `Could not find program with id ${id}`
      })
    } else {
      database('projects').where({
        program_id: id,
        id: projectId
      }).select()
        .then(project => {
          if(project.length) {
            response.status(200).json(project[0]);
          } else {
            response.status(404).json({
              error: `There is no project with id ${projectId}`
            })
          }
    
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    }
  })

});


// POST

// post a new program

app.post('/api/v1/programs', (request, response) => {
  const program = request.body;

  for (let requiredParameter of ['name', 'beneficiaries', 'budget']) {
    if (!program[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, beneficiaries: <Number>, budget: <Number> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('programs').insert(program, 'id')
    .then(program => {
      response.status(201).json({ id: program[0] })
    })
    .catch(error => {
      response.status(500).json(  error );
    });
});

// post a new project

app.post('/api/v1/programs/:id', (request, response) => {
  const project = request.body;
  const program_id = request.params.id;

  for (let requiredParameter of ['name', 'status', 'beneficiaries', 'budget']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, beneficiaries: <Number>, budget: <Number> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert({program_id, ...project}, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json( error );
    });
});

// DELETE

// delete a project

app.delete('/api/v1/programs/:id/projects/:projectId', (request, response) => {
  const {id, projectId} = request.params;

 database('projects').where({
    program_id: id,
    id: projectId
  }).del()
    .then(() => {
      response.status(201).json({projectId})
    })
    .catch(error => {
      response.status(422).json( error );
    });
});