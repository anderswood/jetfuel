

let topicsData = [{
  id: 1,
  name: 'Docs',
  links: [
    {id: 1, link_title: 'the google', long_link: 'http://www.google.com', short_link: 'jet.fuel/5ZvQv', click_count: 3},
    {id: 2, link_title: 'MDN', long_link: 'https://developer.mozilla.org/en-US/', short_link: 'jet.fuel/5vohV', click_count: 0},
   ]
},
{
  id: 2,
  name: 'Wasting Time',
  links: [
    {id: 3, link_title: 'the Twitter', long_link: 'http://www.twitter.com', short_link: 'jet.fuel/2H1PG', click_count: 13},
    {id: 4, link_title: 'the \'stagram', long_link: 'http://www.instagram.com', short_link: 'jet.fuel/zsWr', click_count: 5},
   ]
}];

const createTopic = (knex, topic) => {
  return knex('topics').insert({
    name: topic.name
  }, 'id')
  .then(topicId => {
    let linkPromises = [];

    topic.links.forEach(link => {
      linkPromises.push(
        createLink(knex, {
          link_title: link.link_title,
          long_link: link.long_link,
          short_link: link.short_link,
          click_count: link.click_count,
          topic_id: topicId[0]
        })
      );
    });

    return Promise.all(linkPromises);
  });
};

const createLink = (knex, link) => {
  return knex('links').insert(link);
};

exports.seed = (knex, Promise) => {
  return knex('links').del()
    .then(() => knex('topics').del())
    .then(() => {
      let topicPromises = [];

      topicsData.forEach(topic => {
        topicPromises.push(createTopic(knex, topic));
      });

      return Promise.all(topicPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
