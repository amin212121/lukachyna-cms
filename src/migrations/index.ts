import * as migration_20251011_170619 from './20251011_170619';
import * as migration_20260226_201411 from './20260226_201411';

export const migrations = [
  {
    up: migration_20251011_170619.up,
    down: migration_20251011_170619.down,
    name: '20251011_170619',
  },
  {
    up: migration_20260226_201411.up,
    down: migration_20260226_201411.down,
    name: '20260226_201411'
  },
];
