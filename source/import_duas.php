<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';

const DUA_FILES = [
	'ismi_azam',
	'tercumani_ismi_azam',
	'munacati_veysel_karani',
	'sekine',
	'tefriciye',
	'ashabi_bedir',
	'suhedai_uhud',
	'dualar',
];

function import_duas(): void
{
	$pdo = get_database_connection();
	ensure_dua_content_schema($pdo);

	$statement = $pdo->prepare(
		'INSERT INTO dua_contents (slug, sort_order, content_html, updated_at)
		 VALUES (:slug, :sort_order, :content_html, CURRENT_TIMESTAMP)
		 ON CONFLICT(slug) DO UPDATE SET
		 	sort_order = excluded.sort_order,
		 	content_html = excluded.content_html,
		 	updated_at = CURRENT_TIMESTAMP'
	);

	$pdo->beginTransaction();

	foreach (DUA_FILES as $index => $slug) {
		$path = __DIR__ . '/../duas/' . $slug . '.html';
		$content = file_get_contents($path);

		if ($content === false) {
			throw new RuntimeException('Failed to read dua file: ' . $path);
		}

		$statement->execute([
			'slug' => $slug,
			'sort_order' => $index + 1,
			'content_html' => trim($content),
		]);
	}

	$pdo->commit();

	if (PHP_SAPI === 'cli') {
		fwrite(STDOUT, "Imported " . count(DUA_FILES) . " dua contents.\n");
	}
}

import_duas();
