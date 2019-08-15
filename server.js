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