BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "dua_contents" (
	"id" INTEGER NOT NULL,
	"slug" TEXT NOT NULL UNIQUE,
	"language" TEXT NOT NULL DEFAULT 'ar',
	"sort_order" INTEGER NOT NULL,
	"content_html" TEXT NOT NULL,
	"updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE UNIQUE INDEX IF NOT EXISTS "dua_contents_slug_language_idx" ON "dua_contents" (
	"slug",
	"language"
);
COMMIT;
