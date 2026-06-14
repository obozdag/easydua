<?php

declare(strict_types=1);

function get_database_connection(): PDO
{
	static $pdo = null;

	if ($pdo instanceof PDO) {
		return $pdo;
	}

	$pdo = new PDO('sqlite:' . __DIR__ . '/db/cevsen.db', null, null, [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);

	return $pdo;
}

function ensure_dua_content_schema(PDO $pdo): void
{
	$tableExists = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'dua_contents'")->fetch() !== false;

	if (!$tableExists) {
		create_dua_content_table($pdo);
		return;
	}

	$columns = $pdo->query('PRAGMA table_info(dua_contents)')->fetchAll();
	$columnNames = array_column($columns, 'name');
	$needsMigration = !in_array('language', $columnNames, true);
	$hasSlugLanguageIndex = false;

	$indexes = $pdo->query('PRAGMA index_list(dua_contents)')->fetchAll();
	foreach ($indexes as $index) {
		if (($index['name'] ?? '') === 'dua_contents_slug_language_idx' && (int) ($index['unique'] ?? 0) === 1) {
			$hasSlugLanguageIndex = true;
		}

		if (!$needsMigration) {
			if (($index['name'] ?? '') === 'sqlite_autoindex_dua_contents_1' && (int) ($index['unique'] ?? 0) === 1) {
				$needsMigration = true;
			}
		}
	}

	if ($needsMigration) {
		migrate_dua_content_table($pdo, $columnNames);
	}

	if (!$hasSlugLanguageIndex) {
		$pdo->exec('CREATE UNIQUE INDEX IF NOT EXISTS dua_contents_slug_language_idx ON dua_contents (slug, language)');
	}
}

function create_dua_content_table(PDO $pdo): void
{
	$pdo->exec(
		'CREATE TABLE dua_contents (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			slug TEXT NOT NULL,
			language TEXT NOT NULL DEFAULT "ar",
			sort_order INTEGER NOT NULL,
			content_html TEXT NOT NULL,
			updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		)'
	);
	$pdo->exec('DROP INDEX IF EXISTS dua_contents_slug_language_idx');
	$pdo->exec('CREATE UNIQUE INDEX dua_contents_slug_language_idx ON dua_contents (slug, language)');
}

function migrate_dua_content_table(PDO $pdo, array $columnNames): void
{
	$pdo->beginTransaction();

	try {
		$pdo->exec('ALTER TABLE dua_contents RENAME TO dua_contents_legacy');
		create_dua_content_table($pdo);

		$hasLanguageColumn = in_array('language', $columnNames, true);
		$selectLanguage = $hasLanguageColumn ? 'language' : '"ar"';

		$pdo->exec(
			'INSERT INTO dua_contents (id, slug, language, sort_order, content_html, updated_at)
			 SELECT id, slug, ' . $selectLanguage . ', sort_order, content_html, updated_at
			 FROM dua_contents_legacy'
		);

		$pdo->exec('DROP TABLE dua_contents_legacy');
		$pdo->commit();
	} catch (Throwable $exception) {
		$pdo->rollBack();
		throw $exception;
	}
}

function get_dua_content(PDO $pdo, string $slug, string $language = 'ar'): ?array
{
	ensure_dua_content_schema($pdo);

	$statement = $pdo->prepare(
		'SELECT slug, language, sort_order, content_html, updated_at
		 FROM dua_contents
		 WHERE slug = :slug AND language = :language
		 LIMIT 1'
	);
	$statement->execute([
		'slug' => $slug,
		'language' => $language,
	]);

	$result = $statement->fetch();
	return $result === false ? null : $result;
}
