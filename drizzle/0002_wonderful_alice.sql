ALTER TABLE "house" ADD COLUMN "location" text;--> statement-breakpoint
CREATE INDEX "house_user_id_idx" ON "house" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pantry_item_house_id_idx" ON "pantry_item" USING btree ("house_id");