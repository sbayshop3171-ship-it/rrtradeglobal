<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$storageDir = dirname(__DIR__) . '/storage';
$storageFile = $storageDir . '/site-content.json';
$maxPayloadBytes = 15 * 1024 * 1024; // 15MB

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function readStoredContent(string $storageFile): ?array
{
    if (!is_file($storageFile)) {
        return null;
    }

    $raw = @file_get_contents($storageFile);
    if ($raw === false || trim($raw) === '') {
        return null;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return null;
    }

    return $decoded;
}

function writeStoredContent(string $storageDir, string $storageFile, array $content): bool
{
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return false;
    }

    $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        return false;
    }

    $tmpFile = $storageFile . '.tmp';
    if (@file_put_contents($tmpFile, $encoded, LOCK_EX) === false) {
        return false;
    }

    if (!@rename($tmpFile, $storageFile)) {
        @unlink($tmpFile);
        return false;
    }

    @chmod($storageFile, 0664);
    return true;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $content = readStoredContent($storageFile);
    respond(200, [
        'success' => true,
        'content' => $content,
    ]);
}

if ($method !== 'POST') {
    respond(405, ['success' => false, 'error' => 'Method not allowed']);
}

$rawInput = file_get_contents('php://input');
if ($rawInput === false || trim($rawInput) === '') {
    respond(400, ['success' => false, 'error' => 'Empty request body']);
}

if (strlen($rawInput) > $maxPayloadBytes) {
    respond(413, ['success' => false, 'error' => 'Payload too large']);
}

$payload = json_decode($rawInput, true);
if (!is_array($payload)) {
    respond(400, ['success' => false, 'error' => 'Invalid JSON payload']);
}

$content = $payload['content'] ?? null;
if (!is_array($content)) {
    respond(422, ['success' => false, 'error' => 'Invalid content payload']);
}

if (!writeStoredContent($storageDir, $storageFile, $content)) {
    respond(500, ['success' => false, 'error' => 'Failed to save content']);
}

respond(200, [
    'success' => true,
    'content' => $content,
]);
