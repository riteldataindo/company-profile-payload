import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "features_benefits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );
    ALTER TABLE "features_benefits"
      ADD CONSTRAINT "features_benefits_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."features"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "features_benefits_order_idx" ON "features_benefits" USING btree ("_order");
    CREATE INDEX "features_benefits_parent_id_idx" ON "features_benefits" USING btree ("_parent_id");
    CREATE INDEX "features_benefits_locale_idx" ON "features_benefits" USING btree ("_locale");

    CREATE TABLE "features_use_case_examples" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );
    ALTER TABLE "features_use_case_examples"
      ADD CONSTRAINT "features_use_case_examples_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."features"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "features_use_case_examples_order_idx"
      ON "features_use_case_examples" USING btree ("_order");
    CREATE INDEX "features_use_case_examples_parent_id_idx"
      ON "features_use_case_examples" USING btree ("_parent_id");
    CREATE INDEX "features_use_case_examples_locale_idx"
      ON "features_use_case_examples" USING btree ("_locale");

    CREATE TABLE "features_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "features_id" integer
    );
    ALTER TABLE "features_rels"
      ADD CONSTRAINT "features_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."features"("id")
      ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "features_rels"
      ADD CONSTRAINT "features_rels_features_fk"
      FOREIGN KEY ("features_id") REFERENCES "public"."features"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "features_rels_order_idx" ON "features_rels" USING btree ("order");
    CREATE INDEX "features_rels_parent_idx" ON "features_rels" USING btree ("parent_id");
    CREATE INDEX "features_rels_path_idx" ON "features_rels" USING btree ("path");
    CREATE INDEX "features_rels_features_id_idx" ON "features_rels" USING btree ("features_id");

    CREATE TABLE "use_cases_challenges" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );
    ALTER TABLE "use_cases_challenges"
      ADD CONSTRAINT "use_cases_challenges_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "use_cases_challenges_order_idx" ON "use_cases_challenges" USING btree ("_order");
    CREATE INDEX "use_cases_challenges_parent_id_idx"
      ON "use_cases_challenges" USING btree ("_parent_id");
    CREATE INDEX "use_cases_challenges_locale_idx" ON "use_cases_challenges" USING btree ("_locale");

    CREATE TABLE "use_cases_solutions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );
    ALTER TABLE "use_cases_solutions"
      ADD CONSTRAINT "use_cases_solutions_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "use_cases_solutions_order_idx" ON "use_cases_solutions" USING btree ("_order");
    CREATE INDEX "use_cases_solutions_parent_id_idx"
      ON "use_cases_solutions" USING btree ("_parent_id");
    CREATE INDEX "use_cases_solutions_locale_idx" ON "use_cases_solutions" USING btree ("_locale");

    ALTER TABLE "use_cases_rels" ADD COLUMN "use_cases_id" integer;
    ALTER TABLE "use_cases_rels"
      ADD CONSTRAINT "use_cases_rels_use_cases_fk"
      FOREIGN KEY ("use_cases_id") REFERENCES "public"."use_cases"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "use_cases_rels_use_cases_id_idx"
      ON "use_cases_rels" USING btree ("use_cases_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "use_cases_rels_use_cases_id_idx";
    ALTER TABLE "use_cases_rels" DROP CONSTRAINT "use_cases_rels_use_cases_fk";
    ALTER TABLE "use_cases_rels" DROP COLUMN "use_cases_id";
    DROP TABLE "use_cases_solutions" CASCADE;
    DROP TABLE "use_cases_challenges" CASCADE;
    DROP TABLE "features_rels" CASCADE;
    DROP TABLE "features_use_case_examples" CASCADE;
    DROP TABLE "features_benefits" CASCADE;
  `)
}
