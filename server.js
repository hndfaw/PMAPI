const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 3000);
// app.use(express.json());
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
      response.status(200).json(program)
    })
})

// get all projects

app.get('/api/v1/programs/:id/projects', (request, response) => {
  const { id } = request.params
  database('projects').where('program_id', id).select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

// get one project by id

app.get('/api/v1/programs/:id/projects/:projectId', (request, response) => {
  const { id, projectId } = request.params
  database('projects').where({
    program_id: id,
    id: projectId
  }).select()
    .then(project => {
      response.status(200).json(project);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});