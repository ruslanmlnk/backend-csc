import * as migration_20260220_120000_add_sidebar_banner_columns from './20260220_120000_add_sidebar_banner_columns';
import * as migration_20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation from './20260220_130000_add_articles_sidebar_banner_and_blog_banner_relation';
import * as migration_20260220_184818_add_home_banners from './20260220_184818_add_home_banners';
import * as migration_20260221_101721_add_noindex_field from './20260221_101721_add_noindex_field';
import * as migration_20260227_190906_add_home_contact_form from './20260227_190906_add_home_contact_form';
import * as migration_20260301_162109_add_threads_order_id from './20260301_162109_add_threads_order_id';
import * as migration_20260304_120000_add_profile_global_banner from './20260304_120000_add_profile_global_banner';
import * as migration_20260305_000100_add_articles_seo_and_card_poster from './20260305_000100_add_articles_seo_and_card_poster';
import * as migration_20260305_001300_add_articles_views_counter from './20260305_001300_add_articles_views_counter';
import * as migration_20260305_002100_add_forum_page_pins from './20260305_002100_add_forum_page_pins';
import * as migration_20260322_060000_add_blog_horizontal_banner from './20260322_060000_add_blog_horizontal_banner';
import * as migration_20260322_070000_convert_forum_text_to_lexical from './20260322_070000_convert_forum_text_to_lexical';

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
    name: '20260220_184818_add_home_banners',
  },
  {
    up: migration_20260221_101721_add_noindex_field.up,
    down: migration_20260221_101721_add_noindex_field.down,
    name: '20260221_101721_add_noindex_field',
  },
  {
    up: migration_20260227_190906_add_home_contact_form.up,
    down: migration_20260227_190906_add_home_contact_form.down,
    name: '20260227_190906_add_home_contact_form',
  },
  {
    up: migration_20260301_162109_add_threads_order_id.up,
    down: migration_20260301_162109_add_threads_order_id.down,
    name: '20260301_162109_add_threads_order_id'
  },
  {
    up: migration_20260304_120000_add_profile_global_banner.up,
    down: migration_20260304_120000_add_profile_global_banner.down,
    name: '20260304_120000_add_profile_global_banner'
  },
  {
    up: migration_20260305_000100_add_articles_seo_and_card_poster.up,
    down: migration_20260305_000100_add_articles_seo_and_card_poster.down,
    name: '20260305_000100_add_articles_seo_and_card_poster'
  },
  {
    up: migration_20260305_001300_add_articles_views_counter.up,
    down: migration_20260305_001300_add_articles_views_counter.down,
    name: '20260305_001300_add_articles_views_counter'
  },
  {
    up: migration_20260305_002100_add_forum_page_pins.up,
    down: migration_20260305_002100_add_forum_page_pins.down,
    name: '20260305_002100_add_forum_page_pins'
  },
  {
    up: migration_20260322_060000_add_blog_horizontal_banner.up,
    down: migration_20260322_060000_add_blog_horizontal_banner.down,
    name: '20260322_060000_add_blog_horizontal_banner'
  },
  {
    up: migration_20260322_070000_convert_forum_text_to_lexical.up,
    down: migration_20260322_070000_convert_forum_text_to_lexical.down,
    name: '20260322_070000_convert_forum_text_to_lexical'
  },
];
