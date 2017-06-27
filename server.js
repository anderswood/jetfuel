const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'JetFuel';

app.locals.topics = {};
app.locals.links = {};

app.get('/', (request, response) => {
  response.sendFile('index.html')
});

app.get('api/topics/:id')

app.post('/api/topics/', (request, response) => {
  const { topic } = request.body;
  const id = md5(topic);

  if (!topic) {
    return response.status(422).send({
      error: 'no topic name was provided'
    });
  }

  app.locals.topics[id] = topic;

  response.status(201).json({ id, topic })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
