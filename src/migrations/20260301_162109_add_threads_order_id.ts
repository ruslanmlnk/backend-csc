import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "threads" ADD COLUMN "order_id" numeric DEFAULT 0;
  CREATE INDEX "threads_order_id_idx" ON "threads" USING btree ("order_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "threads_order_id_idx";
  ALTER TABLE "threads" DROP COLUMN "order_id";`)
}
