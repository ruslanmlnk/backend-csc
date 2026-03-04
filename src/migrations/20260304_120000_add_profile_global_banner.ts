import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "profile" (
      "id" serial PRIMARY KEY NOT NULL,
      "banner_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profile_banner_id_banners_id_fk'
      ) THEN
        ALTER TABLE "profile"
          ADD CONSTRAINT "profile_banner_id_banners_id_fk"
          FOREIGN KEY ("banner_id")
          REFERENCES "public"."banners"("id")
          ON DELETE set null
          ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "profile_banner_idx" ON "profile" USING btree ("banner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "profile" DROP CONSTRAINT IF EXISTS "profile_banner_id_banners_id_fk";
    DROP INDEX IF EXISTS "profile_banner_idx";
    DROP TABLE IF EXISTS "profile";
  `)
}
