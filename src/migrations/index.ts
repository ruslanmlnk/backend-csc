import * as migration_20260220_120000_add_sidebar_banner_columns from './20260220_120000_add_sidebar_banner_columns'

export const migrations = [
  {
    up: migration_20260220_120000_add_sidebar_banner_columns.up,
    down: migration_20260220_120000_add_sidebar_banner_columns.down,
    name: '20260220_120000_add_sidebar_banner_columns',
  },
]

