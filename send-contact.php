<?php
/**
 * send-contact.php — receives the homepage contact form and emails it to the
 * operator inbox server-side, so a lead survives even if the visitor never
 * completes the copy/paste-into-chat-app flow the JS-only version relied on.
 *
 * No third-party dependency: uses PHP's built-in mail(). If deliverability
 * turns out unreliable on this host (common with mail() on shared hosting),
 * swap the send step below for SMTP (e.g. PHPMailer) using the same $fields.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot: real visitors never see or fill this field (hidden in CSS/HTML).
// Bots that fill every input will trip it; pretend success and drop silently.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function dom_clean($value) {
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n"], ' ', $value); // block header-injection via newlines
    return mb_substr($value, 0, 500);
}

$name    = dom_clean($_POST['name']    ?? '');
$contact = dom_clean($_POST['contact'] ?? '');
$program = dom_clean($_POST['program'] ?? '');
$date    = dom_clean($_POST['date']    ?? '');
$promo   = dom_clean($_POST['promo']   ?? '');

if ($name === '' && $contact === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'empty']);
    exit;
}

$to      = 'domwomensspase@yandex.ru';
$subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта ДОМ') . '?=';

$lines = ['Здравствуйте! Новая заявка с сайта ДОМ.'];
if ($name    !== '') $lines[] = "Имя: $name";
if ($contact !== '') $lines[] = "Контакт: $contact";
if ($program !== '') $lines[] = "Формат: $program";
if ($date    !== '') $lines[] = "Дата/место: $date";
if ($promo   !== '') $lines[] = "Промокод: $promo";
$body = implode("\n", $lines);

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: DOM site <no-reply@domwomenspace.ru>\r\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed']);
}
