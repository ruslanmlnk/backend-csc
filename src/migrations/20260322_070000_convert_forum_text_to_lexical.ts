import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "threads"
      ALTER COLUMN "content" TYPE jsonb
      USING jsonb_build_object(
        'root',
        jsonb_build_object(
          'type', 'root',
          'children',
          COALESCE(
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'children',
                  CASE
                    WHEN btrim(paragraph_text) = '' THEN jsonb_build_array()
                    ELSE jsonb_build_array(
                      jsonb_build_object(
                        'detail', 0,
                        'format', 0,
                        'mode', 'normal',
                        'style', '',
                        'text', paragraph_text,
                        'type', 'text',
                        'version', 1
                      )
                    )
                  END,
                  'direction', NULL,
                  'format', '',
                  'indent', 0,
                  'textFormat', 0,
                  'textStyle', '',
                  'type', 'paragraph',
                  'version', 1
                )
              )
              FROM unnest(
                regexp_split_to_array(
                  replace(COALESCE("content", ''), E'\r\n', E'\n'),
                  E'\n+'
                )
              ) AS paragraph_text
              WHERE paragraph_text IS NOT NULL
            ),
            jsonb_build_array(
              jsonb_build_object(
                'children', jsonb_build_array(),
                'direction', NULL,
                'format', '',
                'indent', 0,
                'textFormat', 0,
                'textStyle', '',
                'type', 'paragraph',
                'version', 1
              )
            )
          ),
          'direction', NULL,
          'format', '',
          'indent', 0,
          'version', 1
        )
      );

    ALTER TABLE "comments"
      ALTER COLUMN "comment" TYPE jsonb
      USING jsonb_build_object(
        'root',
        jsonb_build_object(
          'type', 'root',
          'children',
          COALESCE(
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'children',
                  CASE
                    WHEN btrim(paragraph_text) = '' THEN jsonb_build_array()
                    ELSE jsonb_build_array(
                      jsonb_build_object(
                        'detail', 0,
                        'format', 0,
                        'mode', 'normal',
                        'style', '',
                        'text', paragraph_text,
                        'type', 'text',
                        'version', 1
                      )
                    )
                  END,
                  'direction', NULL,
                  'format', '',
                  'indent', 0,
                  'textFormat', 0,
                  'textStyle', '',
                  'type', 'paragraph',
                  'version', 1
                )
              )
              FROM unnest(
                regexp_split_to_array(
                  replace(COALESCE("comment", ''), E'\r\n', E'\n'),
                  E'\n+'
                )
              ) AS paragraph_text
              WHERE paragraph_text IS NOT NULL
            ),
            jsonb_build_array(
              jsonb_build_object(
                'children', jsonb_build_array(),
                'direction', NULL,
                'format', '',
                'indent', 0,
                'textFormat', 0,
                'textStyle', '',
                'type', 'paragraph',
                'version', 1
              )
            )
          ),
          'direction', NULL,
          'format', '',
          'indent', 0,
          'version', 1
        )
      );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "threads"
      ALTER COLUMN "content" TYPE text
      USING COALESCE(
        (
          SELECT string_agg(
            COALESCE(
              (
                SELECT string_agg(
                  CASE
                    WHEN child->>'type' = 'linebreak' THEN E'\n'
                    ELSE COALESCE(child->>'text', '')
                  END,
                  ''
                )
                FROM jsonb_array_elements(COALESCE(paragraph->'children', '[]'::jsonb)) AS child
              ),
              ''
            ),
            E'\n\n'
          )
          FROM jsonb_array_elements(COALESCE("content"->'root'->'children', '[]'::jsonb)) AS paragraph
        ),
        ''
      );

    ALTER TABLE "comments"
      ALTER COLUMN "comment" TYPE text
      USING COALESCE(
        (
          SELECT string_agg(
            COALESCE(
              (
                SELECT string_agg(
                  CASE
                    WHEN child->>'type' = 'linebreak' THEN E'\n'
                    ELSE COALESCE(child->>'text', '')
                  END,
                  ''
                )
                FROM jsonb_array_elements(COALESCE(paragraph->'children', '[]'::jsonb)) AS child
              ),
              ''
            ),
            E'\n\n'
          )
          FROM jsonb_array_elements(COALESCE("comment"->'root'->'children', '[]'::jsonb)) AS paragraph
        ),
        ''
      );
  `)
}
