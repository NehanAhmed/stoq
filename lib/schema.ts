import { pgTable, text, integer, timestamp, boolean, uuid, pgEnum, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	onboarding: boolean("onboarding").default(false).notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// Enums for pantry_item
export const stockStatusEnum = pgEnum("stock_status", ["IN_STOCK", "LOW", "OUT"]);
export const categoryEnum = pgEnum("category", [
	"PRODUCE",
	"DAIRY",
	"DRY_GOODS",
	"BEVERAGES",
	"CONDIMENTS",
	"OTHER",
]);
export const addedViaEnum = pgEnum("added_via", ["RECEIPT", "MANUAL"]);

// House table
export const house = pgTable("house", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	noOfMembers: integer("no_of_members").notNull(),
	location: text("location"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	userIdIdx: index("house_user_id_idx").on(table.userId),
}));

// Pantry Item table
export const pantryItem = pgTable("pantry_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	houseId: uuid("house_id")
		.notNull()
		.references(() => house.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	quantity: text("quantity").notNull(),
	unit: text("unit").notNull(),
	stockStatus: stockStatusEnum("stock_status").notNull().default("IN_STOCK"),
	category: categoryEnum("category").notNull().default("OTHER"),
	addedVia: addedViaEnum("added_via").notNull().default("MANUAL"),
	lastRestockedAt: timestamp("last_restocked_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	houseIdIdx: index("pantry_item_house_id_idx").on(table.houseId),
}));
