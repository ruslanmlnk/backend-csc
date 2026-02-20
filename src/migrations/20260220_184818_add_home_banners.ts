import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partnerships_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_conferences_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_jobs_badge" AS ENUM('none', 'top', 'urgent');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"name" varchar,
  	"bio" varchar,
  	"company" varchar,
  	"position" varchar,
  	"directions" varchar,
  	"instagram" varchar,
  	"facebook" varchar,
  	"linkedin" varchar,
  	"telegram" varchar,
  	"tiktok" varchar,
  	"website" varchar,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "banners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"image_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"author_id" integer NOT NULL,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"sidebar_banner_id" integer,
  	"content" jsonb NOT NULL,
  	"status" "enum_articles_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"logo_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"description" varchar NOT NULL,
  	"price_label" varchar NOT NULL,
  	"website_url" varchar,
  	"handle" varchar,
  	"main_image_id" integer,
  	"sidebar_banner_id" integer,
  	"promo_code" varchar,
  	"promo_description" varchar,
  	"content" jsonb NOT NULL,
  	"status" "enum_services_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partnership_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partnerships_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"model" varchar NOT NULL
  );
  
  CREATE TABLE "partnerships_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"offer" varchar NOT NULL
  );
  
  CREATE TABLE "partnerships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"logo_id" integer NOT NULL,
  	"category_id" integer,
  	"rating" varchar NOT NULL,
  	"founded_year" varchar NOT NULL,
  	"location_id" integer,
  	"min_payment" varchar NOT NULL,
  	"website_url" varchar,
  	"sidebar_banner_id" integer,
  	"content" jsonb NOT NULL,
  	"status" "enum_partnerships_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"logo_id" integer NOT NULL,
  	"description" varchar DEFAULT '',
  	"location_id" integer,
  	"conference_date" timestamp(3) with time zone,
  	"vertical_id" integer,
  	"website_url" varchar,
  	"main_image_id" integer,
  	"sidebar_banner_id" integer,
  	"content" jsonb NOT NULL,
  	"status" "enum_conferences_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conferences_verticals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_formats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"badge" "enum_jobs_badge" DEFAULT 'none',
  	"location_id" integer NOT NULL,
  	"format_id" integer NOT NULL,
  	"experience_id" integer NOT NULL,
  	"salary" varchar NOT NULL,
  	"salary_info" varchar NOT NULL,
  	"sidebar_banner_id" integer,
  	"content" jsonb NOT NULL,
  	"status" "enum_jobs_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forum_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forum_sub_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"text_above_date" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"category_id" integer NOT NULL,
  	"banner_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"thread_id" integer NOT NULL,
  	"comment" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "threads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"is_locked" boolean DEFAULT false,
  	"content" varchar NOT NULL,
  	"author_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "threads_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"banners_id" integer,
  	"articles_id" integer,
  	"categories_id" integer,
  	"service_categories_id" integer,
  	"services_id" integer,
  	"partnership_categories_id" integer,
  	"partnerships_id" integer,
  	"conferences_id" integer,
  	"conferences_verticals_id" integer,
  	"job_locations_id" integer,
  	"job_experiences_id" integer,
  	"job_formats_id" integer,
  	"jobs_id" integer,
  	"contact_requests_id" integer,
  	"forum_categories_id" integer,
  	"forum_sub_categories_id" integer,
  	"comments_id" integer,
  	"threads_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_core_values_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"hero_value_proposition" varchar NOT NULL,
  	"hero_primary_button_link" varchar NOT NULL,
  	"hero_secondary_button_link" varchar NOT NULL,
  	"hero_banner_id" integer,
  	"what_we_do_badge_text" varchar DEFAULT 'What we do' NOT NULL,
  	"what_we_do_title" varchar DEFAULT 'Performance marketing built on data' NOT NULL,
  	"what_we_do_description" varchar DEFAULT 'ClickStorm is a performance-driven agency working at the intersection of traffic arbitrage, CPA marketing, and analytics. We launch, test, and scale traffic across multiple sources while keeping full control over metrics, budgets, and profitability.' NOT NULL,
  	"what_we_do_button_link" varchar DEFAULT '/services' NOT NULL,
  	"latest_posts_banner_id" integer,
  	"partnerships_programs_banner_id" integer,
  	"core_values_badge_text" varchar DEFAULT 'Core Values' NOT NULL,
  	"core_values_title" varchar DEFAULT 'The Values that Drive Everything We Do' NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partnerships_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_v2_title" varchar NOT NULL,
  	"hero_v2_description" varchar NOT NULL,
  	"hero_v2_banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "conferences_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_v2_title" varchar NOT NULL,
  	"hero_v2_description" varchar NOT NULL,
  	"hero_v2_banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_v2_title" varchar NOT NULL,
  	"hero_v2_description" varchar NOT NULL,
  	"hero_v2_banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "jobs_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_v2_title" varchar NOT NULL,
  	"hero_v2_description" varchar NOT NULL,
  	"hero_v2_banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "forum_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_v2_title" varchar NOT NULL,
  	"hero_v2_description" varchar NOT NULL,
  	"hero_v2_banner_id" integer,
  	"sidebar_banner_id" integer,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "login_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_banner_id" integer,
  	"right_banner_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "register_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_banner_id" integer,
  	"right_banner_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "banners" ADD CONSTRAINT "banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships_models" ADD CONSTRAINT "partnerships_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnerships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerships_offers" ADD CONSTRAINT "partnerships_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partnerships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_category_id_partnership_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."partnership_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_location_id_job_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."job_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_location_id_job_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."job_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_vertical_id_conferences_verticals_id_fk" FOREIGN KEY ("vertical_id") REFERENCES "public"."conferences_verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_location_id_job_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."job_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_format_id_job_formats_id_fk" FOREIGN KEY ("format_id") REFERENCES "public"."job_formats"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_experience_id_job_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."job_experiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_sub_categories" ADD CONSTRAINT "forum_sub_categories_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_sub_categories" ADD CONSTRAINT "forum_sub_categories_banner_id_banners_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "threads" ADD CONSTRAINT "threads_category_id_forum_sub_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_sub_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "threads" ADD CONSTRAINT "threads_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "threads_texts" ADD CONSTRAINT "threads_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_banners_fk" FOREIGN KEY ("banners_id") REFERENCES "public"."banners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_categories_fk" FOREIGN KEY ("service_categories_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partnership_categories_fk" FOREIGN KEY ("partnership_categories_id") REFERENCES "public"."partnership_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partnerships_fk" FOREIGN KEY ("partnerships_id") REFERENCES "public"."partnerships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conferences_fk" FOREIGN KEY ("conferences_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conferences_verticals_fk" FOREIGN KEY ("conferences_verticals_id") REFERENCES "public"."conferences_verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_locations_fk" FOREIGN KEY ("job_locations_id") REFERENCES "public"."job_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_experiences_fk" FOREIGN KEY ("job_experiences_id") REFERENCES "public"."job_experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_formats_fk" FOREIGN KEY ("job_formats_id") REFERENCES "public"."job_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_requests_fk" FOREIGN KEY ("contact_requests_id") REFERENCES "public"."contact_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forum_categories_fk" FOREIGN KEY ("forum_categories_id") REFERENCES "public"."forum_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forum_sub_categories_fk" FOREIGN KEY ("forum_sub_categories_id") REFERENCES "public"."forum_sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_threads_fk" FOREIGN KEY ("threads_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_core_values_cards" ADD CONSTRAINT "home_core_values_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_core_values_cards" ADD CONSTRAINT "home_core_values_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_banner_id_banners_id_fk" FOREIGN KEY ("hero_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_latest_posts_banner_id_banners_id_fk" FOREIGN KEY ("latest_posts_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_partnerships_programs_banner_id_banners_id_fk" FOREIGN KEY ("partnerships_programs_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_banner_id_banners_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships_page" ADD CONSTRAINT "partnerships_page_hero_v2_banner_id_banners_id_fk" FOREIGN KEY ("hero_v2_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships_page" ADD CONSTRAINT "partnerships_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences_page" ADD CONSTRAINT "conferences_page_hero_v2_banner_id_banners_id_fk" FOREIGN KEY ("hero_v2_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences_page" ADD CONSTRAINT "conferences_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_v2_banner_id_banners_id_fk" FOREIGN KEY ("hero_v2_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_page" ADD CONSTRAINT "jobs_page_hero_v2_banner_id_banners_id_fk" FOREIGN KEY ("hero_v2_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_page" ADD CONSTRAINT "jobs_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_page" ADD CONSTRAINT "forum_page_hero_v2_banner_id_banners_id_fk" FOREIGN KEY ("hero_v2_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_page" ADD CONSTRAINT "forum_page_sidebar_banner_id_banners_id_fk" FOREIGN KEY ("sidebar_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_page" ADD CONSTRAINT "forum_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "login_page" ADD CONSTRAINT "login_page_left_banner_id_banners_id_fk" FOREIGN KEY ("left_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "login_page" ADD CONSTRAINT "login_page_right_banner_id_banners_id_fk" FOREIGN KEY ("right_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "register_page" ADD CONSTRAINT "register_page_left_banner_id_banners_id_fk" FOREIGN KEY ("left_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "register_page" ADD CONSTRAINT "register_page_right_banner_id_banners_id_fk" FOREIGN KEY ("right_banner_id") REFERENCES "public"."banners"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "banners_image_idx" ON "banners" USING btree ("image_id");
  CREATE INDEX "banners_updated_at_idx" ON "banners" USING btree ("updated_at");
  CREATE INDEX "banners_created_at_idx" ON "banners" USING btree ("created_at");
  CREATE INDEX "articles_tags_order_idx" ON "articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "articles_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_image_idx" ON "articles" USING btree ("image_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_sidebar_banner_idx" ON "articles" USING btree ("sidebar_banner_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "service_categories_slug_idx" ON "service_categories" USING btree ("slug");
  CREATE INDEX "service_categories_updated_at_idx" ON "service_categories" USING btree ("updated_at");
  CREATE INDEX "service_categories_created_at_idx" ON "service_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_logo_idx" ON "services" USING btree ("logo_id");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");
  CREATE INDEX "services_main_image_idx" ON "services" USING btree ("main_image_id");
  CREATE INDEX "services_sidebar_banner_idx" ON "services" USING btree ("sidebar_banner_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "partnership_categories_slug_idx" ON "partnership_categories" USING btree ("slug");
  CREATE INDEX "partnership_categories_updated_at_idx" ON "partnership_categories" USING btree ("updated_at");
  CREATE INDEX "partnership_categories_created_at_idx" ON "partnership_categories" USING btree ("created_at");
  CREATE INDEX "partnerships_models_order_idx" ON "partnerships_models" USING btree ("_order");
  CREATE INDEX "partnerships_models_parent_id_idx" ON "partnerships_models" USING btree ("_parent_id");
  CREATE INDEX "partnerships_offers_order_idx" ON "partnerships_offers" USING btree ("_order");
  CREATE INDEX "partnerships_offers_parent_id_idx" ON "partnerships_offers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partnerships_slug_idx" ON "partnerships" USING btree ("slug");
  CREATE INDEX "partnerships_logo_idx" ON "partnerships" USING btree ("logo_id");
  CREATE INDEX "partnerships_category_idx" ON "partnerships" USING btree ("category_id");
  CREATE INDEX "partnerships_location_idx" ON "partnerships" USING btree ("location_id");
  CREATE INDEX "partnerships_sidebar_banner_idx" ON "partnerships" USING btree ("sidebar_banner_id");
  CREATE INDEX "partnerships_updated_at_idx" ON "partnerships" USING btree ("updated_at");
  CREATE INDEX "partnerships_created_at_idx" ON "partnerships" USING btree ("created_at");
  CREATE UNIQUE INDEX "conferences_slug_idx" ON "conferences" USING btree ("slug");
  CREATE INDEX "conferences_logo_idx" ON "conferences" USING btree ("logo_id");
  CREATE INDEX "conferences_location_idx" ON "conferences" USING btree ("location_id");
  CREATE INDEX "conferences_vertical_idx" ON "conferences" USING btree ("vertical_id");
  CREATE INDEX "conferences_main_image_idx" ON "conferences" USING btree ("main_image_id");
  CREATE INDEX "conferences_sidebar_banner_idx" ON "conferences" USING btree ("sidebar_banner_id");
  CREATE INDEX "conferences_updated_at_idx" ON "conferences" USING btree ("updated_at");
  CREATE INDEX "conferences_created_at_idx" ON "conferences" USING btree ("created_at");
  CREATE UNIQUE INDEX "conferences_verticals_slug_idx" ON "conferences_verticals" USING btree ("slug");
  CREATE INDEX "conferences_verticals_updated_at_idx" ON "conferences_verticals" USING btree ("updated_at");
  CREATE INDEX "conferences_verticals_created_at_idx" ON "conferences_verticals" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_locations_slug_idx" ON "job_locations" USING btree ("slug");
  CREATE INDEX "job_locations_updated_at_idx" ON "job_locations" USING btree ("updated_at");
  CREATE INDEX "job_locations_created_at_idx" ON "job_locations" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_experiences_slug_idx" ON "job_experiences" USING btree ("slug");
  CREATE INDEX "job_experiences_updated_at_idx" ON "job_experiences" USING btree ("updated_at");
  CREATE INDEX "job_experiences_created_at_idx" ON "job_experiences" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_formats_slug_idx" ON "job_formats" USING btree ("slug");
  CREATE INDEX "job_formats_updated_at_idx" ON "job_formats" USING btree ("updated_at");
  CREATE INDEX "job_formats_created_at_idx" ON "job_formats" USING btree ("created_at");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_location_idx" ON "jobs" USING btree ("location_id");
  CREATE INDEX "jobs_format_idx" ON "jobs" USING btree ("format_id");
  CREATE INDEX "jobs_experience_idx" ON "jobs" USING btree ("experience_id");
  CREATE INDEX "jobs_sidebar_banner_idx" ON "jobs" USING btree ("sidebar_banner_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "contact_requests_updated_at_idx" ON "contact_requests" USING btree ("updated_at");
  CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "forum_categories_slug_idx" ON "forum_categories" USING btree ("slug");
  CREATE INDEX "forum_categories_updated_at_idx" ON "forum_categories" USING btree ("updated_at");
  CREATE INDEX "forum_categories_created_at_idx" ON "forum_categories" USING btree ("created_at");
  CREATE INDEX "forum_sub_categories_category_idx" ON "forum_sub_categories" USING btree ("category_id");
  CREATE INDEX "forum_sub_categories_banner_idx" ON "forum_sub_categories" USING btree ("banner_id");
  CREATE UNIQUE INDEX "forum_sub_categories_slug_idx" ON "forum_sub_categories" USING btree ("slug");
  CREATE INDEX "forum_sub_categories_updated_at_idx" ON "forum_sub_categories" USING btree ("updated_at");
  CREATE INDEX "forum_sub_categories_created_at_idx" ON "forum_sub_categories" USING btree ("created_at");
  CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");
  CREATE INDEX "comments_thread_idx" ON "comments" USING btree ("thread_id");
  CREATE INDEX "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
  CREATE INDEX "threads_category_idx" ON "threads" USING btree ("category_id");
  CREATE INDEX "threads_author_idx" ON "threads" USING btree ("author_id");
  CREATE INDEX "threads_updated_at_idx" ON "threads" USING btree ("updated_at");
  CREATE INDEX "threads_created_at_idx" ON "threads" USING btree ("created_at");
  CREATE INDEX "threads_texts_order_parent" ON "threads_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_banners_id_idx" ON "payload_locked_documents_rels" USING btree ("banners_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_service_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("service_categories_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_partnership_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("partnership_categories_id");
  CREATE INDEX "payload_locked_documents_rels_partnerships_id_idx" ON "payload_locked_documents_rels" USING btree ("partnerships_id");
  CREATE INDEX "payload_locked_documents_rels_conferences_id_idx" ON "payload_locked_documents_rels" USING btree ("conferences_id");
  CREATE INDEX "payload_locked_documents_rels_conferences_verticals_id_idx" ON "payload_locked_documents_rels" USING btree ("conferences_verticals_id");
  CREATE INDEX "payload_locked_documents_rels_job_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("job_locations_id");
  CREATE INDEX "payload_locked_documents_rels_job_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("job_experiences_id");
  CREATE INDEX "payload_locked_documents_rels_job_formats_id_idx" ON "payload_locked_documents_rels" USING btree ("job_formats_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_contact_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_requests_id");
  CREATE INDEX "payload_locked_documents_rels_forum_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("forum_categories_id");
  CREATE INDEX "payload_locked_documents_rels_forum_sub_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("forum_sub_categories_id");
  CREATE INDEX "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");
  CREATE INDEX "payload_locked_documents_rels_threads_id_idx" ON "payload_locked_documents_rels" USING btree ("threads_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_core_values_cards_order_idx" ON "home_core_values_cards" USING btree ("_order");
  CREATE INDEX "home_core_values_cards_parent_id_idx" ON "home_core_values_cards" USING btree ("_parent_id");
  CREATE INDEX "home_core_values_cards_icon_idx" ON "home_core_values_cards" USING btree ("icon_id");
  CREATE INDEX "home_hero_banner_idx" ON "home" USING btree ("hero_banner_id");
  CREATE INDEX "home_latest_posts_banner_idx" ON "home" USING btree ("latest_posts_banner_id");
  CREATE INDEX "home_partnerships_programs_banner_idx" ON "home" USING btree ("partnerships_programs_banner_id");
  CREATE INDEX "home_seo_seo_og_image_idx" ON "home" USING btree ("seo_og_image_id");
  CREATE INDEX "blog_banner_idx" ON "blog" USING btree ("banner_id");
  CREATE INDEX "blog_seo_seo_og_image_idx" ON "blog" USING btree ("seo_og_image_id");
  CREATE INDEX "partnerships_page_hero_v2_hero_v2_banner_idx" ON "partnerships_page" USING btree ("hero_v2_banner_id");
  CREATE INDEX "partnerships_page_seo_seo_og_image_idx" ON "partnerships_page" USING btree ("seo_og_image_id");
  CREATE INDEX "conferences_page_hero_v2_hero_v2_banner_idx" ON "conferences_page" USING btree ("hero_v2_banner_id");
  CREATE INDEX "conferences_page_seo_seo_og_image_idx" ON "conferences_page" USING btree ("seo_og_image_id");
  CREATE INDEX "services_page_hero_v2_hero_v2_banner_idx" ON "services_page" USING btree ("hero_v2_banner_id");
  CREATE INDEX "services_page_seo_seo_og_image_idx" ON "services_page" USING btree ("seo_og_image_id");
  CREATE INDEX "jobs_page_hero_v2_hero_v2_banner_idx" ON "jobs_page" USING btree ("hero_v2_banner_id");
  CREATE INDEX "jobs_page_seo_seo_og_image_idx" ON "jobs_page" USING btree ("seo_og_image_id");
  CREATE INDEX "forum_page_hero_v2_hero_v2_banner_idx" ON "forum_page" USING btree ("hero_v2_banner_id");
  CREATE INDEX "forum_page_sidebar_banner_idx" ON "forum_page" USING btree ("sidebar_banner_id");
  CREATE INDEX "forum_page_seo_seo_og_image_idx" ON "forum_page" USING btree ("seo_og_image_id");
  CREATE INDEX "login_page_left_banner_idx" ON "login_page" USING btree ("left_banner_id");
  CREATE INDEX "login_page_right_banner_idx" ON "login_page" USING btree ("right_banner_id");
  CREATE INDEX "register_page_left_banner_idx" ON "register_page" USING btree ("left_banner_id");
  CREATE INDEX "register_page_right_banner_idx" ON "register_page" USING btree ("right_banner_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "banners" CASCADE;
  DROP TABLE "articles_tags" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "service_categories" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "partnership_categories" CASCADE;
  DROP TABLE "partnerships_models" CASCADE;
  DROP TABLE "partnerships_offers" CASCADE;
  DROP TABLE "partnerships" CASCADE;
  DROP TABLE "conferences" CASCADE;
  DROP TABLE "conferences_verticals" CASCADE;
  DROP TABLE "job_locations" CASCADE;
  DROP TABLE "job_experiences" CASCADE;
  DROP TABLE "job_formats" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "contact_requests" CASCADE;
  DROP TABLE "forum_categories" CASCADE;
  DROP TABLE "forum_sub_categories" CASCADE;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "threads" CASCADE;
  DROP TABLE "threads_texts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_core_values_cards" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "partnerships_page" CASCADE;
  DROP TABLE "conferences_page" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "jobs_page" CASCADE;
  DROP TABLE "forum_page" CASCADE;
  DROP TABLE "login_page" CASCADE;
  DROP TABLE "register_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_partnerships_status";
  DROP TYPE "public"."enum_conferences_status";
  DROP TYPE "public"."enum_jobs_badge";
  DROP TYPE "public"."enum_jobs_status";`)
}
