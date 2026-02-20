import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "hero_banner_id" integer;
    ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "latest_posts_banner_id" integer;
    ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "partnerships_programs_banner_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'home_hero_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "home"
          ADD CONSTRAINT "home_hero_banner_id_banners_id_fk"
          FOREIGN KEY ("hero_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'home_latest_posts_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "home"
          ADD CONSTRAINT "home_latest_posts_banner_id_banners_id_fk"
          FOREIGN KEY ("latest_posts_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'home_partnerships_programs_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "home"
          ADD CONSTRAINT "home_partnerships_programs_banner_id_banners_id_fk"
          FOREIGN KEY ("partnerships_programs_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "home_hero_banner_idx" ON "home" USING btree ("hero_banner_id");
    CREATE INDEX IF NOT EXISTS "home_latest_posts_banner_idx" ON "home" USING btree ("latest_posts_banner_id");
    CREATE INDEX IF NOT EXISTS "home_partnerships_programs_banner_idx" ON "home" USING btree ("partnerships_programs_banner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home" DROP CONSTRAINT IF EXISTS "home_hero_banner_id_banners_id_fk";
    ALTER TABLE "home" DROP CONSTRAINT IF EXISTS "home_latest_posts_banner_id_banners_id_fk";
    ALTER TABLE "home" DROP CONSTRAINT IF EXISTS "home_partnerships_programs_banner_id_banners_id_fk";

    DROP INDEX IF EXISTS "home_hero_banner_idx";
    DROP INDEX IF EXISTS "home_latest_posts_banner_idx";
    DROP INDEX IF EXISTS "home_partnerships_programs_banner_idx";

    ALTER TABLE "home" DROP COLUMN IF EXISTS "hero_banner_id";
    ALTER TABLE "home" DROP COLUMN IF EXISTS "latest_posts_banner_id";
    ALTER TABLE "home" DROP COLUMN IF EXISTS "partnerships_programs_banner_id";
  `)
}
