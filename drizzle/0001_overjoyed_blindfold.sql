CREATE TYPE "public"."added_via" AS ENUM('RECEIPT', 'MANUAL');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('PRODUCE', 'DAIRY', 'DRY_GOODS', 'BEVERAGES', 'CONDIMENTS', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."stock_status" AS ENUM('IN_STOCK', 'LOW', 'OUT');--> statement-breakpoint
CREATE TABLE "house" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"no_of_members" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pantry_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" uuid NOT NULL,
	"name" text NOT NULL,
	"quantity" text NOT NULL,
	"unit" text NOT NULL,
	"stock_status" "stock_status" DEFAULT 'IN_STOCK' NOT NULL,
	"category" "category" DEFAULT 'OTHER' NOT NULL,
	"added_via" "added_via" DEFAULT 'MANUAL' NOT NULL,
	"last_restocked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" 
ALTER COLUMN "onboarding" SET DATA TYPE boolean 
USING ("onboarding"::boolean);
--> statement-breakpoint
ALTER TABLE "house" ADD CONSTRAINT "house_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pantry_item" ADD CONSTRAINT "pantry_item_house_id_house_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."house"("id") ON DELETE cascade ON UPDATE no action;