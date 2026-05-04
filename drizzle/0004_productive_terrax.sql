CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" uuid NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"ingredients" jsonb NOT NULL,
	"instructions" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "pantry_item_house_name_unique_idx";--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_house_id_house_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."house"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipes_house_id_idx" ON "recipes" USING btree ("house_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pantry_item_house_name_unique_idx" ON "pantry_item" USING btree ("house_id","name");