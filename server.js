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

  console.log(app.locals.topics);
  response.status(201).json({ id, topic })
})

app.post('/api/links/', (request, response) => {
  const { link, linkTitle, topicId } = request.body;
  const id = md5(link);

  if (!link) {
    return response.status(422).send({
      error: 'no valid link was provided'
    });
  }

  app.locals.links[id] = { url: link, title: linkTitle, topic_ID: topicId };

  console.log(app.locals.links);
  response.status(201).json({ id, link, linkTitle, topicId })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
