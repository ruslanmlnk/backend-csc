import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "card_poster_id" integer;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_title" varchar DEFAULT '' NOT NULL;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_description" varchar DEFAULT '' NOT NULL;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_og_image_id" integer;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "seo_noindex" boolean DEFAULT false;

    UPDATE "articles"
    SET
      "seo_title" = CASE
        WHEN "seo_title" = '' THEN COALESCE("title", '')
        ELSE "seo_title"
      END,
      "seo_description" = CASE
        WHEN "seo_description" = '' THEN COALESCE("title", '')
        ELSE "seo_description"
      END,
      "seo_noindex" = COALESCE("noindex", false)
    WHERE
      "seo_title" = ''
      OR "seo_description" = ''
      OR "seo_noindex" IS NULL;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'articles_card_poster_id_media_id_fk'
      ) THEN
        ALTER TABLE "articles"
          ADD CONSTRAINT "articles_card_poster_id_media_id_fk"
          FOREIGN KEY ("card_poster_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'articles_seo_og_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "articles"
          ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk"
          FOREIGN KEY ("seo_og_image_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "articles_card_poster_idx" ON "articles" USING btree ("card_poster_id");
    CREATE INDEX IF NOT EXISTS "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_card_poster_id_media_id_fk";
    ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_seo_og_image_id_media_id_fk";

    DROP INDEX IF EXISTS "articles_card_poster_idx";
    DROP INDEX IF EXISTS "articles_seo_seo_og_image_idx";

    ALTER TABLE "articles" DROP COLUMN IF EXISTS "card_poster_id";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_title";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_description";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_og_image_id";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "seo_noindex";
  `)
}
