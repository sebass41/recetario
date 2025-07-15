<?php

require_once "../model/CuentaDAO.php"; // Incluye el archivo CuentaDAO.php, que contiene la clase CuentaDAO

$funcion = $_GET['fun']; // Obtiene el parámetro 'fun' de la URL

switch ($funcion) {
    case 'crearCuenta':
        crearCuenta();
        break;
    case 'iniciarSesion':
        iniciarSesion();
        break;
    case 'iniciarSesionGoogle':
        iniciarSesionGoogle();
        break;
}

function crearCuenta() {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $contraseña = $_POST['contraseña'];

    $cuentaDAO = new CuentaDAO();
    $resultado = $cuentaDAO->setCuenta($nombre, $email, $contraseña);

    echo json_encode($resultado);
}

function iniciarSesion() {
    $email = $_POST['email'];
    $contraseña = $_POST['contraseña'];

    $cuentaDAO = new CuentaDAO();
    $resultado = $cuentaDAO->iniciarSesion($email, $contraseña);

    echo json_encode($resultado);
}

function iniciarSesionGoogle() {
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? null;

    if (!$token) {
        echo json_encode(new Respuesta(false, "Token faltante", null));
        return;
    }

    // Verificar token con Google
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

        $cuentaDAO = new CuentaDAO();
        $resultado = $cuentaDAO->iniciarSesionGoogle($nombre, $email);

        echo json_encode($resultado);
    } else {
        echo json_encode(new Respuesta(false, "Token inválido", null));
    }
    error_log("Payload recibido: " . json_encode($payload));
error_log("AUD esperado: " . $clientEsperado);
error_log("AUD recibido: " . $payload['aud']);
}
?>