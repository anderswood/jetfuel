
let topicsData = [{
  name: 'Cat',
  links: [
    {link_title: 'the google', long_link: 'google.com', short_link: 'abc', click_count: 3},
    {link_title: 'the cnn', long_link: 'cnn.com', short_link: 'cnn', click_count: 0},
   ]
},
{
  name: 'Dog',
  links: [
    {link_title: 'the dog', long_link: 'dog.com', short_link: 'dog', click_count: 13},
    {link_title: 'the dogggg', long_link: 'dogggg.com', short_link: 'doggy', click_count: 5},
   ]
}]

const createTopic = (knex, topic) => {
  return knex('topics').insert({
    name: topic.name
  }, 'id') //return auto-generated id
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
      )
    });

    return Promise.all(linkPromises)
  });
};

const createLink = (knex, link) => {
  return knex('links').insert(link);
};

exports.seed = (knex, Promise) => {
  return knex('links').del() // delete links first
    .then(() => knex('topics').del()) // delete all papers
    .then(() => {
      let topicPromises = [];

      topicsData.forEach(topic => {
        topicPromises.push(createTopic(knex, topic));
      });

      return Promise.all(topicPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
