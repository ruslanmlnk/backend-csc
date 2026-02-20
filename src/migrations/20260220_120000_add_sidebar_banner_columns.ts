import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "sidebar_banner_id" integer;
    ALTER TABLE "partnerships" ADD COLUMN IF NOT EXISTS "sidebar_banner_id" integer;
    ALTER TABLE "conferences" ADD COLUMN IF NOT EXISTS "sidebar_banner_id" integer;
    ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "sidebar_banner_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'services_sidebar_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "services"
          ADD CONSTRAINT "services_sidebar_banner_id_banners_id_fk"
          FOREIGN KEY ("sidebar_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'partnerships_sidebar_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "partnerships"
          ADD CONSTRAINT "partnerships_sidebar_banner_id_banners_id_fk"
          FOREIGN KEY ("sidebar_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'conferences_sidebar_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "conferences"
          ADD CONSTRAINT "conferences_sidebar_banner_id_banners_id_fk"
          FOREIGN KEY ("sidebar_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'jobs_sidebar_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "jobs"
          ADD CONSTRAINT "jobs_sidebar_banner_id_banners_id_fk"
          FOREIGN KEY ("sidebar_banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "services_sidebar_banner_idx" ON "services" USING btree ("sidebar_banner_id");
    CREATE INDEX IF NOT EXISTS "partnerships_sidebar_banner_idx" ON "partnerships" USING btree ("sidebar_banner_id");
    CREATE INDEX IF NOT EXISTS "conferences_sidebar_banner_idx" ON "conferences" USING btree ("sidebar_banner_id");
    CREATE INDEX IF NOT EXISTS "jobs_sidebar_banner_idx" ON "jobs" USING btree ("sidebar_banner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_sidebar_banner_id_banners_id_fk";
    ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "partnerships_sidebar_banner_id_banners_id_fk";
    ALTER TABLE "conferences" DROP CONSTRAINT IF EXISTS "conferences_sidebar_banner_id_banners_id_fk";
    ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_sidebar_banner_id_banners_id_fk";

    DROP INDEX IF EXISTS "services_sidebar_banner_idx";
    DROP INDEX IF EXISTS "partnerships_sidebar_banner_idx";
    DROP INDEX IF EXISTS "conferences_sidebar_banner_idx";
    DROP INDEX IF EXISTS "jobs_sidebar_banner_idx";

    ALTER TABLE "services" DROP COLUMN IF EXISTS "sidebar_banner_id";
    ALTER TABLE "partnerships" DROP COLUMN IF EXISTS "sidebar_banner_id";
    ALTER TABLE "conferences" DROP COLUMN IF EXISTS "sidebar_banner_id";
    ALTER TABLE "jobs" DROP COLUMN IF EXISTS "sidebar_banner_id";
  `)
}

