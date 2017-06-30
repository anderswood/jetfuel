const express = require('express');
const bodyParser = require('body-parser');
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
        error: `Expected format: { name: <String>}. You are missing the ${requiredParameter} property.`
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


app.get('/api/v1/topics/:topic_id/links', (request, response) => {
  console.log(request.params);

  database('links').where('topic_id', request.params.topic_id).select()
    .then( links => {
      if (links.length) {
        response.status(200).json(links);
      } else {
        response.status(404).json({
          error: `Could not find topic with id ${request.params.topic_id}`
        })
      }
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.get('/jet.fuel/:short_link', (req, res) => {
  const bodyLink = req.params.short_link;

  database('links').where({
    short_link: `jet.fuel/${bodyLink}`
  })
  .then(url => {
    res.redirect(301, url[0].long_link)
  })
  .catch(error => {
    res.status(404).json({
      error: 'URL was not found'
    })
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

app.put('/api/v1/links/clickCountIncr', (req, res) => {
  let updatedClickCount = parseInt(req.body.clickCount) + 1
  database('links').where('short_link', req.body.shortLinkText).update('click_count', updatedClickCount)
    .then( thing => {
      res.status(201).json({ response: 'click_count successfully incremented' })
    })
    .catch( error => {
      res.status(500).json({ error });
    })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
  })
}

module.exports = app;
