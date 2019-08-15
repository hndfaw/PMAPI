exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('programs', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('beneficiaries');
      table.integer('budget');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('status');
      table.integer('beneficiaries');
      table.integer('budget');
      table.integer('program_id').unsigned()
      table.foreign('program_id')
        .references('programs.id');

      table.timestamps(true , true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('programs'),
    knex.schema.dropTable('projects')
  ])
};