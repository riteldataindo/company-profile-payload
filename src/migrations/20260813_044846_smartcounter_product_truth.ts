import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_features_product_truth_solution_type" AS ENUM('shared', 'retail', 'mall');
  CREATE TYPE "public"."enum_features_product_truth_public_availability" AS ENUM('available', 'deployment-dependent', 'pilot', 'roadmap', 'not-public');
  CREATE TYPE "public"."enum_features_product_truth_commercial_entitlement" AS ENUM('core', 'add-on', 'proposal', 'not-public');
  CREATE TYPE "public"."enum_features_evidence_media_status" AS ENUM('real-redacted', 'illustrative-sample', 'conceptual-flow', 'none');
  CREATE TYPE "public"."enum_use_cases_solution_type" AS ENUM('shared', 'retail', 'mall');
  CREATE TYPE "public"."enum_use_cases_evidence_status" AS ENUM('permissioned', 'illustrative', 'none');
  CREATE TYPE "public"."enum_form_submissions_solution" AS ENUM('shared', 'retail', 'mall');
  CREATE TYPE "public"."enum_deployment_locations_deployment_type" AS ENUM('unverified', 'retail', 'mall', 'mixed');
  CREATE TYPE "public"."enum_deployment_locations_permission_status" AS ENUM('unreviewed', 'approved', 'expired', 'revoked');
  CREATE TYPE "public"."enum_client_logos_permission_status" AS ENUM('unreviewed', 'approved', 'expired', 'revoked');
  CREATE TYPE "public"."enum_client_logos_customer_status" AS ENUM('unverified', 'active', 'former');
  CREATE TYPE "public"."enum_media_approved_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_media_provenance_status" AS ENUM('unreviewed', 'real-redacted', 'real-public', 'illustrative-sample', 'conceptual');
  CREATE TYPE "public"."enum_media_permission_status" AS ENUM('unreviewed', 'approved', 'restricted', 'expired');
  CREATE TYPE "public"."enum_claims_allowed_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_claims_claim_type" AS ENUM('capability', 'performance', 'customer', 'deployment', 'privacy', 'commercial', 'technical', 'service');
  CREATE TYPE "public"."enum_claims_status" AS ENUM('draft', 'approved', 'expired', 'rejected');
  CREATE TABLE "media_approved_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_media_approved_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "media_approved_routes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" varchar NOT NULL
  );

  CREATE TABLE "claims_allowed_routes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route" varchar NOT NULL
  );

  CREATE TABLE "claims_allowed_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_claims_allowed_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "claims" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"claim_type" "enum_claims_claim_type" NOT NULL,
  	"status" "enum_claims_status" DEFAULT 'draft' NOT NULL,
  	"owner" varchar NOT NULL,
  	"source_artifact" varchar NOT NULL,
  	"numerator_denominator" varchar,
  	"cohort_or_site_class" varchar,
  	"approved_at" timestamp(3) with time zone,
  	"review_at" timestamp(3) with time zone NOT NULL,
  	"customer_permission" boolean DEFAULT false,
  	"legal_permission" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "claims_locales" (
  	"approved_sentence" varchar NOT NULL,
  	"definition" varchar,
  	"method_and_exclusions" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  -- Keep inactive locale rows in storage. The application exposes EN/ID only,
  -- while preserving KO/JA/ZH content for a separately approved future release.
  ALTER TABLE "features" ALTER COLUMN "is_visible" SET DEFAULT false;
  ALTER TABLE "use_cases" ALTER COLUMN "is_visible" SET DEFAULT false;
  ALTER TABLE "faq_items" ALTER COLUMN "is_visible" SET DEFAULT false;
  ALTER TABLE "deployment_locations" ALTER COLUMN "is_visible" SET DEFAULT false;
  ALTER TABLE "client_logos" ALTER COLUMN "is_visible" SET DEFAULT false;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "whatsapp_number" DROP DEFAULT;
  ALTER TABLE "blog_posts" ADD COLUMN "is_visible" boolean DEFAULT false;
  ALTER TABLE "blog_categories" ADD COLUMN "is_visible" boolean DEFAULT false;
  ALTER TABLE "features" ADD COLUMN "stable_id" varchar;
  UPDATE "features" AS feature
  SET "stable_id" = COALESCE(
    (
      SELECT NULLIF(localized."slug", '')
      FROM "features_locales" AS localized
      WHERE localized."_parent_id" = feature."id"
        AND localized."_locale" = 'en'
      LIMIT 1
    ),
    'feature-' || feature."id"::text
  );
  ALTER TABLE "features" ALTER COLUMN "stable_id" SET NOT NULL;
  ALTER TABLE "features" ADD COLUMN "product_truth_solution_type" "enum_features_product_truth_solution_type" DEFAULT 'shared' NOT NULL;
  ALTER TABLE "features" ADD COLUMN "product_truth_public_availability" "enum_features_product_truth_public_availability" DEFAULT 'deployment-dependent' NOT NULL;
  ALTER TABLE "features" ADD COLUMN "product_truth_commercial_entitlement" "enum_features_product_truth_commercial_entitlement" DEFAULT 'proposal' NOT NULL;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_cctv" boolean;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_sensor" boolean;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_gpu" boolean;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_pos" boolean;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_floor_plan" boolean;
  ALTER TABLE "features" ADD COLUMN "product_truth_requirements_network" boolean;
  ALTER TABLE "features" ADD COLUMN "evidence_media_status" "enum_features_evidence_media_status" DEFAULT 'none' NOT NULL;
  ALTER TABLE "features" ADD COLUMN "evidence_owner" varchar;
  ALTER TABLE "features" ADD COLUMN "evidence_reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "features" ADD COLUMN "publicly_approved" boolean DEFAULT false;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_requirements_other" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_input_and_prerequisites" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_output_definition" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_unit_and_time_window" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_update_behavior" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_measurement_scope" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_retail_meaning" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_mall_meaning" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_decision_supported" varchar;
  ALTER TABLE "features_locales" ADD COLUMN "product_truth_limitations_and_validation" varchar;
  ALTER TABLE "features_rels" ADD COLUMN "claims_id" integer;
  ALTER TABLE "use_cases" ADD COLUMN "solution_type" "enum_use_cases_solution_type" DEFAULT 'shared' NOT NULL;
  ALTER TABLE "use_cases" ADD COLUMN "evidence_status" "enum_use_cases_evidence_status" DEFAULT 'none' NOT NULL;
  ALTER TABLE "use_cases" ADD COLUMN "evidence_owner" varchar;
  ALTER TABLE "use_cases" ADD COLUMN "reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "use_cases" ADD COLUMN "publicly_approved" boolean DEFAULT false;
  ALTER TABLE "use_cases_locales" ADD COLUMN "prerequisites" varchar;
  ALTER TABLE "use_cases_locales" ADD COLUMN "limitations" varchar;
  ALTER TABLE "use_cases_rels" ADD COLUMN "claims_id" integer;
  ALTER TABLE "pricing_tiers" ADD COLUMN "is_visible" boolean DEFAULT false;
  ALTER TABLE "faq_items" ADD COLUMN "publicly_approved" boolean DEFAULT false;
  ALTER TABLE "form_submissions" ADD COLUMN "solution" "enum_form_submissions_solution" DEFAULT 'shared' NOT NULL;
  ALTER TABLE "deployment_locations" ADD COLUMN "deployment_type" "enum_deployment_locations_deployment_type" DEFAULT 'unverified' NOT NULL;
  ALTER TABLE "deployment_locations" ADD COLUMN "provenance_source" varchar;
  ALTER TABLE "deployment_locations" ADD COLUMN "active_since" timestamp(3) with time zone;
  ALTER TABLE "deployment_locations" ADD COLUMN "permission_status" "enum_deployment_locations_permission_status" DEFAULT 'unreviewed' NOT NULL;
  ALTER TABLE "deployment_locations" ADD COLUMN "review_at" timestamp(3) with time zone;
  ALTER TABLE "client_logos" ADD COLUMN "permission_status" "enum_client_logos_permission_status" DEFAULT 'unreviewed' NOT NULL;
  ALTER TABLE "client_logos" ADD COLUMN "customer_status" "enum_client_logos_customer_status" DEFAULT 'unverified' NOT NULL;
  ALTER TABLE "client_logos" ADD COLUMN "module_scope" varchar;
  ALTER TABLE "client_logos" ADD COLUMN "site_scope" varchar;
  ALTER TABLE "client_logos" ADD COLUMN "permission_date" timestamp(3) with time zone;
  ALTER TABLE "client_logos" ADD COLUMN "review_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "provenance_status" "enum_media_provenance_status" DEFAULT 'unreviewed' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "source" varchar;
  ALTER TABLE "media" ADD COLUMN "owner" varchar;
  ALTER TABLE "media" ADD COLUMN "captured_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "permission_status" "enum_media_permission_status" DEFAULT 'unreviewed' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "review_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "claims_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "identity_verified" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "legal_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "product_operator" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "form_privacy_url" varchar DEFAULT '/privacy';
  ALTER TABLE "site_settings_locales" ADD COLUMN "support_hours" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "response_expectation" varchar;
  ALTER TABLE "media_approved_locales" ADD CONSTRAINT "media_approved_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_approved_routes" ADD CONSTRAINT "media_approved_routes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "claims_allowed_routes" ADD CONSTRAINT "claims_allowed_routes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "claims_allowed_locales" ADD CONSTRAINT "claims_allowed_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "claims_locales" ADD CONSTRAINT "claims_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_approved_locales_order_idx" ON "media_approved_locales" USING btree ("order");
  CREATE INDEX "media_approved_locales_parent_idx" ON "media_approved_locales" USING btree ("parent_id");
  CREATE INDEX "media_approved_routes_order_idx" ON "media_approved_routes" USING btree ("_order");
  CREATE INDEX "media_approved_routes_parent_id_idx" ON "media_approved_routes" USING btree ("_parent_id");
  CREATE INDEX "claims_allowed_routes_order_idx" ON "claims_allowed_routes" USING btree ("_order");
  CREATE INDEX "claims_allowed_routes_parent_id_idx" ON "claims_allowed_routes" USING btree ("_parent_id");
  CREATE INDEX "claims_allowed_locales_order_idx" ON "claims_allowed_locales" USING btree ("order");
  CREATE INDEX "claims_allowed_locales_parent_idx" ON "claims_allowed_locales" USING btree ("parent_id");
  CREATE UNIQUE INDEX "claims_key_idx" ON "claims" USING btree ("key");
  CREATE INDEX "claims_updated_at_idx" ON "claims" USING btree ("updated_at");
  CREATE INDEX "claims_created_at_idx" ON "claims" USING btree ("created_at");
  CREATE UNIQUE INDEX "claims_locales_locale_parent_id_unique" ON "claims_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "features_rels" ADD CONSTRAINT "features_rels_claims_fk" FOREIGN KEY ("claims_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_rels" ADD CONSTRAINT "use_cases_rels_claims_fk" FOREIGN KEY ("claims_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_claims_fk" FOREIGN KEY ("claims_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "features_stable_id_idx" ON "features" USING btree ("stable_id");
  CREATE INDEX "features_rels_claims_id_idx" ON "features_rels" USING btree ("claims_id");
  CREATE INDEX "use_cases_rels_claims_id_idx" ON "use_cases_rels" USING btree ("claims_id");
  CREATE INDEX "payload_locked_documents_rels_claims_id_idx" ON "payload_locked_documents_rels" USING btree ("claims_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Inactive locale rows and enum values were retained by the up migration.
  ALTER TABLE "media_approved_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_approved_routes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "claims_allowed_routes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "claims_allowed_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "claims" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "claims_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_approved_locales" CASCADE;
  DROP TABLE "media_approved_routes" CASCADE;
  DROP TABLE "claims_allowed_routes" CASCADE;
  DROP TABLE "claims_allowed_locales" CASCADE;
  DROP TABLE "claims" CASCADE;
  DROP TABLE "claims_locales" CASCADE;
  ALTER TABLE "features_rels" DROP CONSTRAINT "features_rels_claims_fk";

  ALTER TABLE "use_cases_rels" DROP CONSTRAINT "use_cases_rels_claims_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_claims_fk";

  DROP INDEX "features_stable_id_idx";
  DROP INDEX "features_rels_claims_id_idx";
  DROP INDEX "use_cases_rels_claims_id_idx";
  DROP INDEX "payload_locked_documents_rels_claims_id_idx";
  ALTER TABLE "features" ALTER COLUMN "is_visible" SET DEFAULT true;
  ALTER TABLE "use_cases" ALTER COLUMN "is_visible" SET DEFAULT true;
  ALTER TABLE "faq_items" ALTER COLUMN "is_visible" SET DEFAULT true;
  ALTER TABLE "deployment_locations" ALTER COLUMN "is_visible" SET DEFAULT true;
  ALTER TABLE "client_logos" ALTER COLUMN "is_visible" SET DEFAULT true;
  ALTER TABLE "blog_posts" DROP COLUMN "is_visible";
  ALTER TABLE "blog_categories" DROP COLUMN "is_visible";
  ALTER TABLE "features" DROP COLUMN "stable_id";
  ALTER TABLE "features" DROP COLUMN "product_truth_solution_type";
  ALTER TABLE "features" DROP COLUMN "product_truth_public_availability";
  ALTER TABLE "features" DROP COLUMN "product_truth_commercial_entitlement";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_cctv";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_sensor";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_gpu";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_pos";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_floor_plan";
  ALTER TABLE "features" DROP COLUMN "product_truth_requirements_network";
  ALTER TABLE "features" DROP COLUMN "evidence_media_status";
  ALTER TABLE "features" DROP COLUMN "evidence_owner";
  ALTER TABLE "features" DROP COLUMN "evidence_reviewed_at";
  ALTER TABLE "features" DROP COLUMN "publicly_approved";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_requirements_other";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_input_and_prerequisites";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_output_definition";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_unit_and_time_window";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_update_behavior";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_measurement_scope";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_retail_meaning";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_mall_meaning";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_decision_supported";
  ALTER TABLE "features_locales" DROP COLUMN "product_truth_limitations_and_validation";
  ALTER TABLE "features_rels" DROP COLUMN "claims_id";
  ALTER TABLE "use_cases" DROP COLUMN "solution_type";
  ALTER TABLE "use_cases" DROP COLUMN "evidence_status";
  ALTER TABLE "use_cases" DROP COLUMN "evidence_owner";
  ALTER TABLE "use_cases" DROP COLUMN "reviewed_at";
  ALTER TABLE "use_cases" DROP COLUMN "publicly_approved";
  ALTER TABLE "use_cases_locales" DROP COLUMN "prerequisites";
  ALTER TABLE "use_cases_locales" DROP COLUMN "limitations";
  ALTER TABLE "use_cases_rels" DROP COLUMN "claims_id";
  ALTER TABLE "pricing_tiers" DROP COLUMN "is_visible";
  ALTER TABLE "faq_items" DROP COLUMN "publicly_approved";
  ALTER TABLE "form_submissions" DROP COLUMN "solution";
  ALTER TABLE "deployment_locations" DROP COLUMN "deployment_type";
  ALTER TABLE "deployment_locations" DROP COLUMN "provenance_source";
  ALTER TABLE "deployment_locations" DROP COLUMN "active_since";
  ALTER TABLE "deployment_locations" DROP COLUMN "permission_status";
  ALTER TABLE "deployment_locations" DROP COLUMN "review_at";
  ALTER TABLE "client_logos" DROP COLUMN "permission_status";
  ALTER TABLE "client_logos" DROP COLUMN "customer_status";
  ALTER TABLE "client_logos" DROP COLUMN "module_scope";
  ALTER TABLE "client_logos" DROP COLUMN "site_scope";
  ALTER TABLE "client_logos" DROP COLUMN "permission_date";
  ALTER TABLE "client_logos" DROP COLUMN "review_at";
  ALTER TABLE "media" DROP COLUMN "provenance_status";
  ALTER TABLE "media" DROP COLUMN "source";
  ALTER TABLE "media" DROP COLUMN "owner";
  ALTER TABLE "media" DROP COLUMN "captured_at";
  ALTER TABLE "media" DROP COLUMN "permission_status";
  ALTER TABLE "media" DROP COLUMN "review_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "claims_id";
  ALTER TABLE "site_settings" DROP COLUMN "identity_verified";
  ALTER TABLE "site_settings" DROP COLUMN "legal_name";
  ALTER TABLE "site_settings" DROP COLUMN "product_operator";
  ALTER TABLE "site_settings" DROP COLUMN "form_privacy_url";
  ALTER TABLE "site_settings_locales" DROP COLUMN "support_hours";
  ALTER TABLE "site_settings_locales" DROP COLUMN "response_expectation";
  DROP TYPE "public"."enum_features_product_truth_solution_type";
  DROP TYPE "public"."enum_features_product_truth_public_availability";
  DROP TYPE "public"."enum_features_product_truth_commercial_entitlement";
  DROP TYPE "public"."enum_features_evidence_media_status";
  DROP TYPE "public"."enum_use_cases_solution_type";
  DROP TYPE "public"."enum_use_cases_evidence_status";
  DROP TYPE "public"."enum_form_submissions_solution";
  DROP TYPE "public"."enum_deployment_locations_deployment_type";
  DROP TYPE "public"."enum_deployment_locations_permission_status";
  DROP TYPE "public"."enum_client_logos_permission_status";
  DROP TYPE "public"."enum_client_logos_customer_status";
  DROP TYPE "public"."enum_media_approved_locales";
  DROP TYPE "public"."enum_media_provenance_status";
  DROP TYPE "public"."enum_media_permission_status";
  DROP TYPE "public"."enum_claims_allowed_locales";
  DROP TYPE "public"."enum_claims_claim_type";
  DROP TYPE "public"."enum_claims_status";`)
}
