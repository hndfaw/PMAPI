const environment = process.env.NODE_ENV || 'development'; // if production process was undefined set development
const configuration = require('./knexfile')[environment]; // import knexfile cofiguration
const database = require('knex')(configuration); 

const express = require('express'); // import express
const cors = require('cors'); // import cors
const app = express(); // define express as app

app.set('port', process.env.PORT || 3000); // if process environment is undefined set 3000 as a port
app.use(express.json()); // expect all imported files as json
app.use(express.static('public')); // set index file in public directory as my default static page
app.use(cors());

app.locals.title = 'PMAPI'; // the title in my local storage is 'PMAPI'


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
}); // console log my local title and port when I run it locally

// GET

// get all programs

app.get('/api/v1/programs', (request, response) => {
  database('programs').select() // get all data in programs table
    .then(programs => {
      response.status(200).json(programs); // return all data in programs table with the status code of 200
    })
    .catch((error) => {
      response.status(500).json({ error }); // if there was an error returning data, send status of 500
    });
});


// get one program by id

app.get('/api/v1/programs/:id', (request, response) => {
  const {id} = request.params
  database('programs').where('id', id).select() // get the program that its id equals to id in params
    .then(program => {
      if(program.length) {
        response.status(200).json(program[0]) // if a program with that id exist return it with status code of 200
      } else {
        response.status(404).json({
          error: `Could not find program with id ${id}` // if there was no programs with that id, return message with the status code of 404
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error }); // if there is any errors from the servers side return it with the status code of 500
    });
})


// get all projects of one program

app.get('/api/v1/programs/:id/projects', (request, response) => {
  const { id } = request.params

  database('programs').where('id', id).select() // get the program with the id in params
  .then(program => {
    if(!program.length) { 
      response.status(404).json({
        error: `Could not find program with id ${id}`// if the program doesn't exist let user know with sending status code of 404
      })
    } else {
      database('projects').where('program_id', id).select()
        .then(projects => {
          if(projects.length) {
            response.status(200).json(projects); // when the program exist, get all projects under that programs and return them with the status code of 200
          } else {
             response.status(404).json({
          error: `There are no projects under program with id ${id}` // if there were no projects under that program, let the user know and send status code of 404
        })
      }
  })
    .catch((error) => {
    response.status(500).json({ error }); // if there is any errors in servers side let user know with the status code 500
  });
    }
  })

  
});


// get one project by id

app.get('/api/v1/programs/:id/projects/:projectId', (request, response) => {
  const { id, projectId } = request.params

  database('programs').where('id', id).select() // get the program with the program id in the params
  .then(program => {
    if(!program.length) {
      response.status(404).json({
        error: `Could not find program with id ${id}` // if the parogram was not exist let user know and send code of 404
      })
    } else {
      database('projects').where({
        program_id: id,
        id: projectId
      }).select() // if the program was exist, get the project under that program using program id and project id
        .then(project => {
          if(project.length) {
            response.status(200).json(project[0]); // return the selected project with the status code of 200
          } else {
            response.status(404).json({
              error: `There is no project with id ${projectId}` // if there was no projects under that program let the user know and send status code of 404
            })
          }
    
        })
        .catch((error) => {
          response.status(500).json({ error }); // if there was any errors from the server side let the user know.
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
        .status(422) // check that user send an object with all required properties
        .send({ error: `Expected format: { name: <String>, beneficiaries: <Number>, budget: <Number> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('programs').insert(program, 'id')
    .then(program => {
      response.status(201).json({ id: program[0] }) // when the new program posted succesfully return the id to user with the status code of 201
    })
    .catch(error => {
      response.status(500).json(  error ); // if it could not post successfully let the user know with the status code of 500
    });
});

// post a new project

app.post('/api/v1/programs/:id', (request, response) => {
  const project = request.body;
  const program_id = request.params.id;

  for (let requiredParameter of ['name', 'status', 'beneficiaries', 'budget']) {
    if (!project[requiredParameter]) {
      return response
        .status(422) // check that user send an object with all required properties
        .send({ error: `Expected format: { name: <String>, beneficiaries: <Number>, budget: <Number> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert({program_id, ...project}, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] }) // when the new project posted succesfully return the id to user with the status code of 201
    })
    .catch(error => {
      response.status(500).json( error ); // if it could not post successfully let the user know with the status code of 500
    });
});

// DELETE

// delete a program

app.delete('/api/v1/programs/:id', (request, response) => {
  const {id} = request.params;
database('projects').where({
  program_id: id, // get all the projects under that program and delete them
}).del().then(()=>
  database('programs').where({
     id,
  }).del()
  .then(() => {
    response.status(201).json({id}) // delete that program and return the id of deleted program with the status code of 201
  })
  .catch(error => {
    response.status(422).json( error ); // if the program was not deleted successfuly let the user know with sending status code of 422
  })
)
});


// delete a project

app.delete('/api/v1/programs/:id/projects/:projectId', (request, response) => {
  const {id, projectId} = request.params;

 database('projects').where({
    program_id: id,
    id: projectId // find the project with the specific project id and program id and delete it
  }).del()
    .then(() => {
      response.status(201).json({projectId}) // return the id of the deleted project with the status code of 201
    })
    .catch(error => {
      response.status(422).json( error ); // if the project was not deleted let the user know with the status code of 422
    });
});

