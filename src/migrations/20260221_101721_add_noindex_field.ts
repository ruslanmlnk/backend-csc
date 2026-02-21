import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "partnerships" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "conferences" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "jobs" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "threads" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "blog" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "partnerships_page" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "conferences_page" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "services_page" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "jobs_page" ADD COLUMN "seo_noindex" boolean DEFAULT false;
  ALTER TABLE "forum_page" ADD COLUMN "seo_noindex" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "noindex";
  ALTER TABLE "services" DROP COLUMN "noindex";
  ALTER TABLE "partnerships" DROP COLUMN "noindex";
  ALTER TABLE "conferences" DROP COLUMN "noindex";
  ALTER TABLE "jobs" DROP COLUMN "noindex";
  ALTER TABLE "threads" DROP COLUMN "noindex";
  ALTER TABLE "home" DROP COLUMN "seo_noindex";
  ALTER TABLE "blog" DROP COLUMN "seo_noindex";
  ALTER TABLE "partnerships_page" DROP COLUMN "seo_noindex";
  ALTER TABLE "conferences_page" DROP COLUMN "seo_noindex";
  ALTER TABLE "services_page" DROP COLUMN "seo_noindex";
  ALTER TABLE "jobs_page" DROP COLUMN "seo_noindex";
  ALTER TABLE "forum_page" DROP COLUMN "seo_noindex";`)
}
