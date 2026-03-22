import { readFileSync } from 'fs'
import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

type SnapshotColumn = {
  default?: string
  notNull: boolean
  primaryKey: boolean
  type: string
}

type SnapshotForeignKey = {
  columnsFrom: string[]
  columnsTo: string[]
  name: string
  onDelete: string
  onUpdate: string
  tableTo: string
}

type SnapshotIndex = {
  columns: Array<{ expression: string }>
  isUnique: boolean
  name: string
}

type SnapshotTable = {
  columns: Record<string, SnapshotColumn>
  foreignKeys: Record<string, SnapshotForeignKey>
  indexes: Record<string, SnapshotIndex>
  name: string
}

type CopyField = {
  fallback?: string
  source?: string
  sql?: string
  target: string
}

type CopySpec = {
  fields: CopyField[]
  source: string
  target: string
}

type Snapshot = {
  tables: Record<string, SnapshotTable>
}

const snapshot = JSON.parse(
  readFileSync(new URL('./20260322_084046_add_localization_support.json', import.meta.url), 'utf8'),
) as Snapshot

const localeTables = Object.values(snapshot.tables)
  .filter((table) => table.name.endsWith('_locales'))
  .sort((a, b) => a.name.localeCompare(b.name))

const emptyLexicalDocument = `
jsonb_build_object(
  'root',
  jsonb_build_object(
    'type', 'root',
    'children',
    jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'children', jsonb_build_array(),
        'direction', NULL,
        'format', '',
        'indent', 0,
        'textFormat', 0,
        'textStyle', '',
        'version', 1
      )
    ),
    'direction', NULL,
    'format', '',
    'indent', 0,
    'version', 1
  )
)`.trim()

const copySpecs: CopySpec[] = [
  { source: 'articles', target: 'articles_locales', fields: [{ target: 'title', fallback: '' }, { target: 'content', sql: `"content"` }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'articles_tags', target: 'articles_tags_locales', fields: [{ target: 'tag' }] },
  { source: 'banners', target: 'banners_locales', fields: [{ target: 'caption', fallback: '' }] },
  { source: 'blog', target: 'blog_locales', fields: [{ target: 'title', fallback: '' }, { target: 'description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'categories', target: 'categories_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'conferences', target: 'conferences_locales', fields: [{ target: 'title', fallback: '' }, { target: 'description', fallback: '' }, { target: 'content', sql: `"content"` }] },
  { source: 'conferences_page', target: 'conferences_page_locales', fields: [{ target: 'hero_v2_title', fallback: '' }, { target: 'hero_v2_description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'conferences_verticals', target: 'conferences_verticals_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'forum_categories', target: 'forum_categories_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'forum_page', target: 'forum_page_locales', fields: [{ target: 'hero_v2_title', fallback: '' }, { target: 'hero_v2_description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'forum_sub_categories', target: 'forum_sub_categories_locales', fields: [{ target: 'name', fallback: '' }, { target: 'description', fallback: '' }, { target: 'text_above_date', fallback: '' }] },
  { source: 'home', target: 'home_locales', fields: [{ target: 'hero_title', fallback: '' }, { target: 'hero_description', fallback: '' }, { target: 'hero_value_proposition', fallback: '' }, { target: 'what_we_do_badge_text', fallback: 'What we do' }, { target: 'what_we_do_title', fallback: 'Performance marketing built on data' }, { target: 'what_we_do_description', fallback: 'ClickStorm is a performance-driven agency working at the intersection of traffic arbitrage, CPA marketing, and analytics. We launch, test, and scale traffic across multiple sources while keeping full control over metrics, budgets, and profitability.' }, { target: 'core_values_badge_text', fallback: 'Core Values' }, { target: 'core_values_title', fallback: 'The Values that Drive Everything We Do' }, { target: 'contact_form_title', fallback: 'Connect with Us Today' }, { target: 'contact_form_description', fallback: 'Our team is here to help you with any inquiries about our services and features.' }, { target: 'contact_form_address', fallback: '123 Blockchain Ave, Crypto City, CC 10101' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'home_core_values_cards', target: 'home_core_values_cards_locales', fields: [{ target: 'title', fallback: '' }, { target: 'description', fallback: '' }] },
  { source: 'job_experiences', target: 'job_experiences_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'job_formats', target: 'job_formats_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'job_locations', target: 'job_locations_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'jobs', target: 'jobs_locales', fields: [{ target: 'title', fallback: '' }, { target: 'salary', fallback: '' }, { target: 'salary_info', fallback: '' }, { target: 'content', sql: `"content"` }] },
  { source: 'jobs_page', target: 'jobs_page_locales', fields: [{ target: 'hero_v2_title', fallback: '' }, { target: 'hero_v2_description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'partnership_categories', target: 'partnership_categories_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'partnerships', target: 'partnerships_locales', fields: [{ target: 'title', fallback: '' }, { target: 'min_payment', fallback: '' }, { target: 'content', sql: `"content"` }] },
  { source: 'partnerships_models', target: 'partnerships_models_locales', fields: [{ target: 'model', fallback: '' }] },
  { source: 'partnerships_offers', target: 'partnerships_offers_locales', fields: [{ target: 'offer', fallback: '' }] },
  { source: 'partnerships_page', target: 'partnerships_page_locales', fields: [{ target: 'hero_v2_title', fallback: '' }, { target: 'hero_v2_description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
  { source: 'service_categories', target: 'service_categories_locales', fields: [{ target: 'name', fallback: '' }] },
  { source: 'services', target: 'services_locales', fields: [{ target: 'title', fallback: '' }, { target: 'description', fallback: '' }, { target: 'price_label', fallback: '' }, { target: 'promo_description' }, { target: 'content', sql: `"content"` }] },
  { source: 'services_page', target: 'services_page_locales', fields: [{ target: 'hero_v2_title', fallback: '' }, { target: 'hero_v2_description', fallback: '' }, { target: 'seo_title', fallback: '' }, { target: 'seo_description', fallback: '' }] },
]

const sqlString = (value: string): string => `'${value.replace(/'/g, "''")}'`

const buildColumnDefinition = (name: string, column: SnapshotColumn): string => {
  if (column.primaryKey && column.type === 'serial') {
    return `"${name}" serial PRIMARY KEY NOT NULL`
  }

  const parts = [`"${name}" ${column.type}`]
  if (column.notNull) parts.push('NOT NULL')
  if (column.default !== undefined) parts.push(`DEFAULT ${column.default}`)
  return parts.join(' ')
}

const buildCreateStatements = (): string =>
  [
    `DO $$ BEGIN CREATE TYPE "_locales" AS ENUM ('en', 'uk'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
    ...localeTables.map(
      (table) =>
        `CREATE TABLE IF NOT EXISTS "${table.name}" (\n  ${Object.entries(table.columns)
          .map(([name, column]) => buildColumnDefinition(name, column))
          .join(',\n  ')}\n);`,
    ),
    ...localeTables.flatMap((table) =>
      Object.values(table.foreignKeys).map(
        (foreignKey) =>
          `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${foreignKey.name}') THEN ALTER TABLE "${table.name}" ADD CONSTRAINT "${foreignKey.name}" FOREIGN KEY ("${foreignKey.columnsFrom[0]}") REFERENCES "public"."${foreignKey.tableTo}"("${foreignKey.columnsTo[0]}") ON DELETE ${foreignKey.onDelete} ON UPDATE ${foreignKey.onUpdate}; END IF; END $$;`,
      ),
    ),
    ...localeTables.flatMap((table) =>
      Object.values(table.indexes).map((index) => {
        const unique = index.isUnique ? 'UNIQUE ' : ''
        const columns = index.columns.map((column) => `"${column.expression}"`).join(', ')
        return `CREATE ${unique}INDEX IF NOT EXISTS "${index.name}" ON "${table.name}" USING btree (${columns});`
      }),
    ),
  ].join('\n')

const buildFieldSelect = (field: CopyField): string => {
  const source = field.source ?? field.target
  if (field.sql) {
    return `${field.target === 'content' ? `COALESCE(${field.sql}, ${emptyLexicalDocument})` : field.sql} AS "${field.target}"`
  }

  if (field.fallback !== undefined) {
    return `COALESCE("${source}", ${sqlString(field.fallback)}) AS "${field.target}"`
  }

  return `"${source}" AS "${field.target}"`
}

const buildCopyStatements = (): string =>
  copySpecs
    .map((spec) => {
      const fields = spec.fields.map((field) => `"${field.target}"`).join(', ')
      const select = spec.fields.map((field) => `      ${buildFieldSelect(field)}`).join(',\n')
      const updates = spec.fields
        .map((field) => `  "${field.target}" = EXCLUDED."${field.target}"`)
        .join(',\n')

      return [
        `INSERT INTO "${spec.target}" (${fields}, "_locale", "_parent_id")`,
        `SELECT`,
        select + ',',
        `      'en'::_locales AS "_locale",`,
        `      "id" AS "_parent_id"`,
        `FROM "${spec.source}"`,
        `ON CONFLICT ("_locale", "_parent_id") DO UPDATE`,
        `SET`,
        updates + ';',
      ].join('\n')
    })
    .join('\n\n')

const buildDropStatements = (): string =>
  [
    ...localeTables
      .map((table) => table.name)
      .sort()
      .reverse()
      .map((tableName) => `DROP TABLE IF EXISTS "${tableName}" CASCADE;`),
    `DROP TYPE IF EXISTS "_locales";`,
  ].join('\n')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(buildCreateStatements()))
  await db.execute(sql.raw(buildCopyStatements()))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(buildDropStatements()))
}
