import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "forum_page_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "threads_id" integer
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'forum_page_rels_parent_fk'
      ) THEN
        ALTER TABLE "forum_page_rels"
          ADD CONSTRAINT "forum_page_rels_parent_fk"
          FOREIGN KEY ("parent_id")
          REFERENCES "public"."forum_page"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'forum_page_rels_threads_fk'
      ) THEN
        ALTER TABLE "forum_page_rels"
          ADD CONSTRAINT "forum_page_rels_threads_fk"
          FOREIGN KEY ("threads_id")
          REFERENCES "public"."threads"("id")
          ON DELETE cascade
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "forum_page_rels_order_idx" ON "forum_page_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "forum_page_rels_parent_idx" ON "forum_page_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "forum_page_rels_path_idx" ON "forum_page_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "forum_page_rels_threads_id_idx" ON "forum_page_rels" USING btree ("threads_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "forum_page_rels" DROP CONSTRAINT IF EXISTS "forum_page_rels_parent_fk";
    ALTER TABLE "forum_page_rels" DROP CONSTRAINT IF EXISTS "forum_page_rels_threads_fk";

    DROP INDEX IF EXISTS "forum_page_rels_order_idx";
    DROP INDEX IF EXISTS "forum_page_rels_parent_idx";
    DROP INDEX IF EXISTS "forum_page_rels_path_idx";
    DROP INDEX IF EXISTS "forum_page_rels_threads_id_idx";

    DROP TABLE IF EXISTS "forum_page_rels";
  `)
}

