
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('topics', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('links', (table) => {
      table.increments('id').primary();
      table.string('link_title');
      table.string('long_link');
      table.string('short_link');
      table.integer('click_count');
      table.integer('topic_id').unsigned();
      table.foreign('topic_id').references('topics.id');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('topics')
  ]);

};
