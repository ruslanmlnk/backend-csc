import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "contact_form_title" varchar DEFAULT 'Connect with Us Today' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "contact_form_description" varchar DEFAULT 'Our team is here to help you with any inquiries about our services and features.' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "contact_form_phone" varchar DEFAULT '+1 (800) 555-0199' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "contact_form_email" varchar DEFAULT 'support@coinzy.com' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "contact_form_address" varchar DEFAULT '123 Blockchain Ave, Crypto City, CC 10101' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "contact_form_title";
  ALTER TABLE "home" DROP COLUMN "contact_form_description";
  ALTER TABLE "home" DROP COLUMN "contact_form_phone";
  ALTER TABLE "home" DROP COLUMN "contact_form_email";
  ALTER TABLE "home" DROP COLUMN "contact_form_address";`)
}
