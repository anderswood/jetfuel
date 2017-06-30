// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    useNullAsDefault: true,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds/dev' }
  },
  testing: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel_test',
    useNullAsDefault: true,
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds/test'}
  }

};
