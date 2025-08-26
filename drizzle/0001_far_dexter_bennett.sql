ALTER TABLE "artifact_versions" DROP CONSTRAINT "artifact_versions_artifact_id_artifacts_id_fk";
--> statement-breakpoint
DROP INDEX "artifact_versions_artifact_idx";--> statement-breakpoint
ALTER TABLE "artifact_versions" ALTER COLUMN "meta" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_versions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "artifact_versions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "meta" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "artifact_versions" ADD CONSTRAINT "artifact_versions_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artifact_versions_artifact_id_idx" ON "artifact_versions" USING btree ("artifact_id");--> statement-breakpoint
CREATE INDEX "artifact_versions_version_idx" ON "artifact_versions" USING btree ("version");--> statement-breakpoint
CREATE INDEX "artifact_versions_created_at_idx" ON "artifact_versions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "artifacts_created_at_idx" ON "artifacts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "artifacts_type_idx" ON "artifacts" USING btree ("type");--> statement-breakpoint
ALTER TABLE "artifact_versions" ADD CONSTRAINT "artifact_versions_artifact_version_unique" UNIQUE("artifact_id","version");