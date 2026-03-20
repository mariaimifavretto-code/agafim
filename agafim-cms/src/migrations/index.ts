import * as migration_20260319_235902_init from './20260319_235902_init';

export const migrations = [
  {
    up: migration_20260319_235902_init.up,
    down: migration_20260319_235902_init.down,
    name: '20260319_235902_init'
  },
];
