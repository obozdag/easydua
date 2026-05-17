<?php

declare(strict_types=1);

function get_database_connection(): PDO
{
	static $pdo = null;

	if ($pdo instanceof PDO) {
		return $pdo;
	}

	$pdo = new PDO('sqlite:' . __DIR__ . '/../db/cevsen.db', null, null, [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);

	return $pdo;
}

function ensure_dua_content_schema(PDO $pdo): void
{
	$pdo->exec(
		'CREATE TABLE IF NOT EXISTS dua_contents (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			slug TEXT NOT NULL UNIQUE,
			sort_order INTEGER NOT NULL,
			content_html TEXT NOT NULL,
			updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		)'
	);
}

function get_dua_content(PDO $pdo, string $slug): ?array
{
	ensure_dua_content_schema($pdo);

	$statement = $pdo->prepare(
		'SELECT slug, sort_order, content_html, updated_at
		 FROM dua_contents
		 WHERE slug = :slug
		 LIMIT 1'
	);
	$statement->execute(['slug' => $slug]);

	$result = $statement->fetch();
	return $result === false ? null : $result;
}
