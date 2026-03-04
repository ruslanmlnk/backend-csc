import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0;
    UPDATE "articles" SET "views" = 0 WHERE "views" IS NULL;
    ALTER TABLE "articles" ALTER COLUMN "views" SET DEFAULT 0;
    ALTER TABLE "articles" ALTER COLUMN "views" SET NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "views";
  `)
}

