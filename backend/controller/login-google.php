<?php
session_start();
require_once '../conexion/Conexion.php';
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
// Recibir el token JSON del frontend
$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? null;

if (!$token) {
  echo json_encode(['exito' => false, 'error' => 'Token faltante']);
  exit;
}

// Verificar el token llamando a la API de Google
$googleApiUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $token;
$response = file_get_contents($googleApiUrl);

if (!$response) {
  echo json_encode(['exito' => false, 'error' => 'Error al contactar Google']);
  exit;
}

$payload = json_decode($response, true);

// Validar que el token esté bien y el email venga de Google
if (isset($payload['email'], $payload['name']) && $payload['aud'] === '748112355474-bc7asvpdqnn7bc2fmlle5and4gt82l6p.apps.googleusercontent.com') {
  $email = $payload['email'];
  $nombre = $payload['name'];
  
  echo json_encode(['exito' => true]);
} else {
  echo json_encode(['exito' => false, 'error' => 'Token inválido']);
}
?>