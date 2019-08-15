module.exports = {
  development: {
    client: 'pg',
      connection: 'postgres://localhost/program2',
      migrations: {
        directory: './db/migrations'
      },
      seeds: {
        directory: './db/seeds'
      },
      useNullAsDefault: true
  },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
