import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "threads"
      ALTER COLUMN "content" TYPE jsonb
      USING CASE
        WHEN "content" IS NULL OR btrim("content") = '' THEN
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
          )
        ELSE
          jsonb_build_object(
            'root',
            jsonb_build_object(
              'type', 'root',
              'children',
              jsonb_build_array(
                jsonb_build_object(
                  'type', 'paragraph',
                  'children',
                  jsonb_build_array(
                    jsonb_build_object(
                      'type', 'text',
                      'detail', 0,
                      'format', 0,
                      'mode', 'normal',
                      'style', '',
                      'text', replace("content", E'\r\n', E'\n'),
                      'version', 1
                    )
                  ),
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
          )
      END;

    ALTER TABLE "comments"
      ALTER COLUMN "comment" TYPE jsonb
      USING CASE
        WHEN "comment" IS NULL OR btrim("comment") = '' THEN
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
          )
        ELSE
          jsonb_build_object(
            'root',
            jsonb_build_object(
              'type', 'root',
              'children',
              jsonb_build_array(
                jsonb_build_object(
                  'type', 'paragraph',
                  'children',
                  jsonb_build_array(
                    jsonb_build_object(
                      'type', 'text',
                      'detail', 0,
                      'format', 0,
                      'mode', 'normal',
                      'style', '',
                      'text', replace("comment", E'\r\n', E'\n'),
                      'version', 1
                    )
                  ),
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
          )
      END;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "threads"
      ALTER COLUMN "content" TYPE text
      USING COALESCE("content"->'root'->'children'->0->'children'->0->>'text', '');

    ALTER TABLE "comments"
      ALTER COLUMN "comment" TYPE text
      USING COALESCE("comment"->'root'->'children'->0->'children'->0->>'text', '');
  `)
}
