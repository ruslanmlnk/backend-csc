import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "horizontal_banner_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'blog_horizontal_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "blog"
          ADD CONSTRAINT "blog_horizontal_banner_id_banners_id_fk"
          FOREIGN KEY ("horizontal_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "blog_horizontal_banner_idx" ON "blog" USING btree ("horizontal_banner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog" DROP CONSTRAINT IF EXISTS "blog_horizontal_banner_id_banners_id_fk";
    DROP INDEX IF EXISTS "blog_horizontal_banner_idx";
    ALTER TABLE "blog" DROP COLUMN IF EXISTS "horizontal_banner_id";
  `)
}
