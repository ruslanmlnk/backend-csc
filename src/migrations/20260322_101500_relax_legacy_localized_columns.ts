import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const legacyLocalizedColumns: Array<{ table: string; columns: string[] }> = [
  {
    table: 'articles',
    columns: ['title', 'content', 'seo_title', 'seo_description'],
  },
  {
    table: 'articles_tags',
    columns: ['tag'],
  },
  {
    table: 'banners',
    columns: ['caption'],
  },
  {
    table: 'blog',
    columns: ['title', 'description', 'seo_title', 'seo_description'],
  },
  {
    table: 'categories',
    columns: ['name'],
  },
  {
    table: 'conferences',
    columns: ['title', 'description', 'content'],
  },
  {
    table: 'conferences_page',
    columns: ['hero_v2_title', 'hero_v2_description', 'seo_title', 'seo_description'],
  },
  {
    table: 'conferences_verticals',
    columns: ['name'],
  },
  {
    table: 'forum_categories',
    columns: ['name'],
  },
  {
    table: 'forum_page',
    columns: ['hero_v2_title', 'hero_v2_description', 'seo_title', 'seo_description'],
  },
  {
    table: 'forum_sub_categories',
    columns: ['name', 'description', 'text_above_date'],
  },
  {
    table: 'home',
    columns: [
      'hero_title',
      'hero_description',
      'hero_value_proposition',
      'what_we_do_badge_text',
      'what_we_do_title',
      'what_we_do_description',
      'core_values_badge_text',
      'core_values_title',
      'contact_form_title',
      'contact_form_description',
      'contact_form_address',
      'seo_title',
      'seo_description',
    ],
  },
  {
    table: 'home_core_values_cards',
    columns: ['title', 'description'],
  },
  {
    table: 'job_experiences',
    columns: ['name'],
  },
  {
    table: 'job_formats',
    columns: ['name'],
  },
  {
    table: 'job_locations',
    columns: ['name'],
  },
  {
    table: 'jobs',
    columns: ['title', 'salary', 'salary_info', 'content'],
  },
  {
    table: 'jobs_page',
    columns: ['hero_v2_title', 'hero_v2_description', 'seo_title', 'seo_description'],
  },
  {
    table: 'partnership_categories',
    columns: ['name'],
  },
  {
    table: 'partnerships',
    columns: ['title', 'min_payment', 'content'],
  },
  {
    table: 'partnerships_models',
    columns: ['model'],
  },
  {
    table: 'partnerships_offers',
    columns: ['offer'],
  },
  {
    table: 'partnerships_page',
    columns: ['hero_v2_title', 'hero_v2_description', 'seo_title', 'seo_description'],
  },
  {
    table: 'service_categories',
    columns: ['name'],
  },
  {
    table: 'services',
    columns: ['title', 'description', 'price_label', 'promo_description', 'content'],
  },
  {
    table: 'services_page',
    columns: ['hero_v2_title', 'hero_v2_description', 'seo_title', 'seo_description'],
  },
]

const buildDropNotNullStatements = (): string =>
  legacyLocalizedColumns
    .flatMap(({ table, columns }) =>
      columns.map(
        (column) => `
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = '${table}'
      AND column_name = '${column}'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP NOT NULL;
  END IF;
END $$;`.trim(),
      ),
    )
    .join('\n')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(buildDropNotNullStatements()))
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally left as a no-op.
  // Re-adding NOT NULL on legacy columns is unsafe because rows written after localization may contain NULLs.
}
