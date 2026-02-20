import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "sidebar_banner_id" integer;
    ALTER TABLE "blog" ADD COLUMN IF NOT EXISTS "banner_id" integer;

    ALTER TABLE "blog" DROP CONSTRAINT IF EXISTS "blog_banner_id_media_id_fk";
    UPDATE "blog"
    SET "banner_id" = NULL
    WHERE "banner_id" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "banners"
        WHERE "banners"."id" = "blog"."banner_id"
      );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'articles_sidebar_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "articles"
          ADD CONSTRAINT "articles_sidebar_banner_id_banners_id_fk"
          FOREIGN KEY ("sidebar_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'blog_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "blog"
          ADD CONSTRAINT "blog_banner_id_banners_id_fk"
          FOREIGN KEY ("banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "articles_sidebar_banner_idx" ON "articles" USING btree ("sidebar_banner_id");
    CREATE INDEX IF NOT EXISTS "blog_banner_idx" ON "blog" USING btree ("banner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_sidebar_banner_id_banners_id_fk";
    ALTER TABLE "blog" DROP CONSTRAINT IF EXISTS "blog_banner_id_banners_id_fk";
    UPDATE "blog"
    SET "banner_id" = NULL
    WHERE "banner_id" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM "media"
        WHERE "media"."id" = "blog"."banner_id"
      );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'blog_banner_id_media_id_fk'
      ) THEN
        ALTER TABLE "blog"
          ADD CONSTRAINT "blog_banner_id_media_id_fk"
          FOREIGN KEY ("banner_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DROP INDEX IF EXISTS "articles_sidebar_banner_idx";
    DROP INDEX IF EXISTS "blog_banner_idx";

    ALTER TABLE "articles" DROP COLUMN IF EXISTS "sidebar_banner_id";
  `)
}
