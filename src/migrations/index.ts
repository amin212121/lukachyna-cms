import * as migration_20251011_170619 from './20251011_170619';

export const migrations = [
  {
    up: migration_20251011_170619.up,
    down: migration_20251011_170619.down,
    name: '20251011_170619'
  },
];
