const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('index.html')
});

app.get('/api/v1/topics', (req, res) => {
  database('topics').select()
    .then(topics => {
      if (topics.length) {
        res.status(200).json(topics);
      } else {
        res.status(404).json({
          error: 'No topics were found'
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/v1/topics', (req, res) => {
  const topic = req.body;

  for (let requiredParameter of ['name']) {
    if (!topic[requiredParameter]) {
      return res.status(422).json({
        error: `Expected format: { name: <String>}.
        You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('topics').insert(topic, 'id')
    .then(topic => {
      res.status(201).json({ id: topic[0] })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.get('/api/v1/links', (req, res) => {
  database('links').select()
    .then(links => {
      if (links.length) {
        res.status(200).json(links)
      } else {
        res.status(404).json({
          error: 'No links were found'
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error })
    });
});

app.post('/api/v1/links', (req, res) => {
  const link = req.body;

  for (let requiredParameter of ['link_title', 'long_link', 'short_link', 'click_count', 'topic_id']) {
    if (!link[requiredParameter]) {
      return res.status(422).json({
        error: `Expected format: { link_title: <String>, long_link: <String>,
          short_link: <String>, click_count: <Integer>, topic_id: <Integer> }.
          You are missing a ${requiredParameter} property.`
      })
    }
  }

  database('links').insert(link, 'id')
    .then(link => {
      res.status(201).json({ id: link[0] })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
  })
}

// app.locals.title = 'JetFuel';
//
// app.locals.topics = {};
// app.locals.links = {};
//
// app.get('/', (request, response) => {
//   response.sendFile('index.html')
// });
//
// app.get('api/topics/:id')
//
// app.post('/api/topics/', (request, response) => {
//   const { topic } = request.body;
//   const id = md5(topic);
//
//   if (!topic) {
//     return response.status(422).send({
//       error: 'no topic name was provided'
//     });
//   }
//
//   app.locals.topics[id] = topic;
//
//   console.log(app.locals.topics);
//   response.status(201).json({ id, topic })
// })
//
// app.post('/api/links/', (request, response) => {
//   const { link, linkTitle, topicId } = request.body;
//   const id = md5(link);
//
//   if (!link) {
//     return response.status(422).send({
//       error: 'no valid link was provided'
//     });
//   }
//
//   app.locals.links[id] = { url: link, title: linkTitle, topic_ID: topicId };
//
//   console.log(app.locals.links);
//   response.status(201).json({ id, link, linkTitle, topicId })
// })
//
// app.listen(app.get('port'), () => {
//   console.log(`${app.locals.title} is running on ${app.get('port')}.`)
// });
