import * as migration_20261115_121414_initial from './20261115_121414_initial';
import * as migration_20261125_102253_track_covers from './20261125_102253_track_covers';

export const migrations = [
  {
    up: migration_20261115_121414_initial.up,
    down: migration_20261115_121414_initial.down,
    name: '20261115_121414_initial',
  },
  {
    up: migration_20261125_102253_track_covers.up,
    down: migration_20261125_102253_track_covers.down,
    name: '20261125_102253_track_covers'
  },
];
