import * as migration_20260220_120000_add_sidebar_banner_columns from './20260220_120000_add_sidebar_banner_columns';
import * as migration_20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation from './20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation';
import * as migration_20260220_184818_add_home_banners from './20260220_184818_add_home_banners';

export const migrations = [
  {
    up: migration_20260220_120000_add_sidebar_banner_columns.up,
    down: migration_20260220_120000_add_sidebar_banner_columns.down,
    name: '20260220_120000_add_sidebar_banner_columns',
  },
  {
    up: migration_20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation.up,
    down: migration_20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation.down,
    name: '20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation',
  },
  {
    up: migration_20260220_184818_add_home_banners.up,
    down: migration_20260220_184818_add_home_banners.down,
    name: '20260220_184818_add_home_banners'
  },
];
