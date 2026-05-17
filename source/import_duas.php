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

	$deleteStatement = $pdo->prepare('DELETE FROM dua_contents WHERE slug = :slug AND language = :language');
	$insertStatement = $pdo->prepare(
		'INSERT INTO dua_contents (slug, language, sort_order, content_html, updated_at)
		 VALUES (:slug, :language, :sort_order, :content_html, CURRENT_TIMESTAMP)'
	);

	$pdo->beginTransaction();

	foreach (DUA_FILES as $index => $slug) {
		$path = __DIR__ . '/../duas/' . $slug . '.html';
		$content = file_get_contents($path);

		if ($content === false) {
			throw new RuntimeException('Failed to read dua file: ' . $path);
		}

		$params = [
			'slug' => $slug,
			'language' => 'ar',
			'sort_order' => $index + 1,
			'content_html' => trim($content),
		];

		$deleteStatement->execute([
			'slug' => $params['slug'],
			'language' => $params['language'],
		]);
		$insertStatement->execute($params);
	}

	$pdo->commit();

	if (PHP_SAPI === 'cli') {
		fwrite(STDOUT, "Imported " . count(DUA_FILES) . " dua contents.\n");
	}
}

function import_program_info(): void
{
	$pdo = get_database_connection();
	ensure_dua_content_schema($pdo);

	$languages = ['tr', 'en'];
	$deleteStatement = $pdo->prepare('DELETE FROM dua_contents WHERE slug = :slug AND language = :language');
	$insertStatement = $pdo->prepare(
		'INSERT INTO dua_contents (slug, language, sort_order, content_html, updated_at)
		 VALUES (:slug, :language, :sort_order, :content_html, CURRENT_TIMESTAMP)'
	);

	$pdo->beginTransaction();

	foreach ($languages as $language) {
		$path = __DIR__ . '/../languages/' . $language . '/program_info.php';
		$content = file_get_contents($path);

		if ($content === false) {
			throw new RuntimeException('Failed to read program info file: ' . $path);
		}

		$params = [
			'slug' => 'program_info',
			'language' => $language,
			'sort_order' => 0,
			'content_html' => trim($content),
		];

		$deleteStatement->execute([
			'slug' => $params['slug'],
			'language' => $params['language'],
		]);
		$insertStatement->execute($params);
	}

	$pdo->commit();

	if (PHP_SAPI === 'cli') {
		fwrite(STDOUT, "Imported program info content for " . count($languages) . " languages.\n");
	}
}

import_duas();
import_program_info();
