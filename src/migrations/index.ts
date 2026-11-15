import * as migration_20261115_121414_initial from './20261115_121414_initial';

export const migrations = [
  {
    up: migration_20261115_121414_initial.up,
    down: migration_20261115_121414_initial.down,
    name: '20261115_121414_initial'
  },
];
