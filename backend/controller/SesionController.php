<?php
session_start();
require_once "../model/SesionDAO.php"; // Conecta con tu lógica DAO

$funcion = $_GET['fun'];

switch ($funcion) {
    case 'iniciarSesion':
        iniciarSesion();
        break;
    case 'iniciarSesionGoogle':
        iniciarSesionGoogle();
        break;
    case 'cerrarSesion':
        cerrarSesion();
        break;
}

function iniciarSesion() {
    $email = $_POST['email'] ?? '';
    $contraseña = $_POST['contraseña'] ?? '';

    $sesionDAO = new SesionDAO();
    $respuesta = $sesionDAO->iniciarSesion($email, $contraseña);

    echo json_encode($respuesta);
}

function iniciarSesionGoogle() {
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? null;

    if (!$token) {
        echo json_encode(new Respuesta(false, "Token faltante", null));
        return;
    }

    $googleApiUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $token;
    $response = file_get_contents($googleApiUrl);
    if (!$response) {
        echo json_encode(new Respuesta(false, "Error al contactar Google", null));
        return;
    }

    $payload = json_decode($response, true);
    $clientEsperado = '748112355474-bc7asvpdqnn7bc2fmlle5and4gt82l6p.apps.googleusercontent.com';

    if (isset($payload['email'], $payload['name']) && $payload['aud'] === $clientEsperado) {
        $nombre = $payload['name'];
        $email = $payload['email'];

        $sesionDAO = new SesionDAO();
        $respuesta = $sesionDAO->iniciarSesionGoogle($nombre, $email);

        echo json_encode($respuesta);
    } else {
        echo json_encode(new Respuesta(false, "Token inválido", null));
    }
}

function cerrarSesion() {
    session_unset();
    session_destroy();
    echo json_encode(new Respuesta(true, "Sesión cerrada correctamente", null));
}