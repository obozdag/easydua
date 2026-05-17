<?php

declare(strict_types=1);

require_once __DIR__ . '/source/database.php';

header('Content-Type: text/html; charset=utf-8');

$slug = $_GET['slug'] ?? '';

if (!is_string($slug) || preg_match('/^[a-z_]+$/', $slug) !== 1) {
	http_response_code(400);
	echo '<div class="latin"><p class="content_notice">Invalid dua request.</p></div>';
	exit;
}

try {
	$content = get_dua_content(get_database_connection(), $slug);
} catch (Throwable $exception) {
	http_response_code(500);
	echo '<div class="latin"><p class="content_notice">Dua content could not be loaded.</p></div>';
	exit;
}

if ($content === null) {
	http_response_code(404);
	echo '<div class="latin"><p class="content_notice">Dua content was not found.</p></div>';
	exit;
}

echo $content['content_html'];
