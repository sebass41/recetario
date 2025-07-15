<?php
session_start();
require_once "../model/CuentaDAO.php"; // Incluye el archivo CuentaDAO.php, que contiene la clase CuentaDAO

$funcion = $_GET['fun']; // Obtiene el parámetro 'fun' de la URL

switch ($funcion) {
    case 'crearCuenta':
        crearCuenta();
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

?>