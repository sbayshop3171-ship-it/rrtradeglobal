<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$storageDir = dirname(__DIR__) . '/storage';
$storageFile = $storageDir . '/contact-messages.json';
$maxPayloadBytes = 2 * 1024 * 1024; // 2MB
$maxMessages = 500;

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitizeString(mixed $value, string $fallback = ''): string
{
    if (!is_string($value)) {
        return $fallback;
    }

    $trimmed = trim($value);
    return $trimmed !== '' ? $trimmed : $fallback;
}

function readMessages(string $storageFile): array
{
    if (!is_file($storageFile)) {
        return [];
    }

    $raw = @file_get_contents($storageFile);
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return [];
    }

    return $decoded;
}

function writeMessages(string $storageDir, string $storageFile, array $messages): bool
{
    if (!is_dir($storageDir) && !@mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        return false;
    }

    $encoded = json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
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

function normalizeMessage(array $entry, ?string $fallbackId = null): ?array
{
    $nowIso = date('c');
    $fullName = sanitizeString($entry['fullName'] ?? null, 'Visitor');
    $email = sanitizeString($entry['email'] ?? null);
    $phone = sanitizeString($entry['phone'] ?? null);
    $projectType = sanitizeString($entry['projectType'] ?? null);
    $message = sanitizeString($entry['message'] ?? null);
    $pageUrl = sanitizeString($entry['pageUrl'] ?? null);
    $createdAt = sanitizeString($entry['createdAt'] ?? null, $nowIso);
    $id = sanitizeString($entry['id'] ?? null, $fallbackId ?? uniqid('msg-', true));

    if ($email === '' || $message === '') {
        return null;
    }

    return [
        'id' => $id,
        'createdAt' => $createdAt,
        'fullName' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'projectType' => $projectType,
        'message' => $message,
        'pageUrl' => $pageUrl,
    ];
}

function sanitizeMessageList(array $messages, int $maxMessages): array
{
    $safe = [];
    foreach ($messages as $index => $entry) {
        if (!is_array($entry)) {
            continue;
        }

        $normalized = normalizeMessage($entry, 'msg-' . $index);
        if ($normalized === null) {
            continue;
        }

        $safe[] = $normalized;
        if (count($safe) >= $maxMessages) {
            break;
        }
    }

    return $safe;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $messages = sanitizeMessageList(readMessages($storageFile), $maxMessages);
    respond(200, [
        'success' => true,
        'messages' => $messages,
    ]);
}

if ($method === 'DELETE') {
    if (!writeMessages($storageDir, $storageFile, [])) {
        respond(500, ['success' => false, 'error' => 'Failed to clear messages']);
    }

    respond(200, [
        'success' => true,
        'messages' => [],
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

$entry = $payload['message'] ?? null;
if (!is_array($entry)) {
    respond(422, ['success' => false, 'error' => 'Invalid message payload']);
}

$normalized = normalizeMessage($entry);
if ($normalized === null) {
    respond(422, ['success' => false, 'error' => 'Email and message are required']);
}

$messages = sanitizeMessageList(readMessages($storageFile), $maxMessages);
array_unshift($messages, $normalized);
$messages = array_slice($messages, 0, $maxMessages);

if (!writeMessages($storageDir, $storageFile, $messages)) {
    respond(500, ['success' => false, 'error' => 'Failed to save message']);
}

respond(200, [
    'success' => true,
    'message' => $normalized,
    'messagesCount' => count($messages),
]);
