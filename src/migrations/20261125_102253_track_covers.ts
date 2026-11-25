import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "asmr_covers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT false,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "asmr_covers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_asmr_covers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_visible" boolean DEFAULT false,
  	"version_prefix" varchar DEFAULT '',
  	"version__objectkey" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_asmr_covers_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "asmr_tracks" ADD COLUMN "cover_id" integer;
  ALTER TABLE "_asmr_tracks_v" ADD COLUMN "version_cover_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "asmr_covers_id" integer;
  ALTER TABLE "asmr_covers_rels" ADD CONSTRAINT "asmr_covers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."asmr_covers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "asmr_covers_rels" ADD CONSTRAINT "asmr_covers_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_asmr_covers_v" ADD CONSTRAINT "_asmr_covers_v_parent_id_asmr_covers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."asmr_covers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_asmr_covers_v_rels" ADD CONSTRAINT "_asmr_covers_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_asmr_covers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_asmr_covers_v_rels" ADD CONSTRAINT "_asmr_covers_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "asmr_covers_visible_idx" ON "asmr_covers" USING btree ("visible");
  CREATE INDEX "asmr_covers_updated_at_idx" ON "asmr_covers" USING btree ("updated_at");
  CREATE INDEX "asmr_covers_created_at_idx" ON "asmr_covers" USING btree ("created_at");
  CREATE UNIQUE INDEX "asmr_covers_filename_idx" ON "asmr_covers" USING btree ("filename");
  CREATE INDEX "asmr_covers_original_original_filename_idx" ON "asmr_covers" USING btree ("original_filename");
  CREATE INDEX "asmr_covers_rels_order_idx" ON "asmr_covers_rels" USING btree ("order");
  CREATE INDEX "asmr_covers_rels_parent_idx" ON "asmr_covers_rels" USING btree ("parent_id");
  CREATE INDEX "asmr_covers_rels_path_idx" ON "asmr_covers_rels" USING btree ("path");
  CREATE INDEX "asmr_covers_rels_admins_id_idx" ON "asmr_covers_rels" USING btree ("admins_id");
  CREATE INDEX "_asmr_covers_v_parent_idx" ON "_asmr_covers_v" USING btree ("parent_id");
  CREATE INDEX "_asmr_covers_v_version_version_visible_idx" ON "_asmr_covers_v" USING btree ("version_visible");
  CREATE INDEX "_asmr_covers_v_version_version_updated_at_idx" ON "_asmr_covers_v" USING btree ("version_updated_at");
  CREATE INDEX "_asmr_covers_v_version_version_created_at_idx" ON "_asmr_covers_v" USING btree ("version_created_at");
  CREATE INDEX "_asmr_covers_v_version_version_filename_idx" ON "_asmr_covers_v" USING btree ("version_filename");
  CREATE INDEX "_asmr_covers_v_version_original_version_original_filenam_idx" ON "_asmr_covers_v" USING btree ("version_original_filename");
  CREATE INDEX "_asmr_covers_v_created_at_idx" ON "_asmr_covers_v" USING btree ("created_at");
  CREATE INDEX "_asmr_covers_v_updated_at_idx" ON "_asmr_covers_v" USING btree ("updated_at");
  CREATE INDEX "_asmr_covers_v_rels_order_idx" ON "_asmr_covers_v_rels" USING btree ("order");
  CREATE INDEX "_asmr_covers_v_rels_parent_idx" ON "_asmr_covers_v_rels" USING btree ("parent_id");
  CREATE INDEX "_asmr_covers_v_rels_path_idx" ON "_asmr_covers_v_rels" USING btree ("path");
  CREATE INDEX "_asmr_covers_v_rels_admins_id_idx" ON "_asmr_covers_v_rels" USING btree ("admins_id");
  ALTER TABLE "asmr_tracks" ADD CONSTRAINT "asmr_tracks_cover_id_asmr_covers_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."asmr_covers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_asmr_tracks_v" ADD CONSTRAINT "_asmr_tracks_v_version_cover_id_asmr_covers_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."asmr_covers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_asmr_covers_fk" FOREIGN KEY ("asmr_covers_id") REFERENCES "public"."asmr_covers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "asmr_tracks_cover_idx" ON "asmr_tracks" USING btree ("cover_id");
  CREATE INDEX "_asmr_tracks_v_version_version_cover_idx" ON "_asmr_tracks_v" USING btree ("version_cover_id");
  CREATE INDEX "payload_locked_documents_rels_asmr_covers_id_idx" ON "payload_locked_documents_rels" USING btree ("asmr_covers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "asmr_covers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "asmr_covers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_asmr_covers_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_asmr_covers_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "asmr_covers" CASCADE;
  DROP TABLE "asmr_covers_rels" CASCADE;
  DROP TABLE "_asmr_covers_v" CASCADE;
  DROP TABLE "_asmr_covers_v_rels" CASCADE;
  ALTER TABLE "asmr_tracks" DROP CONSTRAINT "asmr_tracks_cover_id_asmr_covers_id_fk";
  
  ALTER TABLE "_asmr_tracks_v" DROP CONSTRAINT "_asmr_tracks_v_version_cover_id_asmr_covers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_asmr_covers_fk";
  
  DROP INDEX "asmr_tracks_cover_idx";
  DROP INDEX "_asmr_tracks_v_version_version_cover_idx";
  DROP INDEX "payload_locked_documents_rels_asmr_covers_id_idx";
  ALTER TABLE "asmr_tracks" DROP COLUMN "cover_id";
  ALTER TABLE "_asmr_tracks_v" DROP COLUMN "version_cover_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "asmr_covers_id";`)
}
