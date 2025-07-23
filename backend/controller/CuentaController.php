<?php
session_start();
require_once "../model/CuentaDAO.php"; // Incluye el archivo CuentaDAO.php, que contiene la clase CuentaDAO

$funcion = $_GET['fun']; // Obtiene el parámetro 'fun' de la URL

switch ($funcion) {
    case 'crearCuenta':
        crearCuenta();
        break;
    case 'getUsr':
        getUser();
        break;
    case 'cambiarImagen':
        cambiarImagenPerfil();
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

function getUser() {
    $id_usr = $_SESSION['id'];

    $cuentaDAO = new CuentaDAO();
    $resultado = $cuentaDAO->getUser($id_usr);

    echo json_encode($resultado);
}

function cambiarImagenPerfil() {
    session_start();
    if (!isset($_SESSION['id'])) {
        echo json_encode(new Respuesta(false, "Sesión no válida", null));
        return;
    }

    $id_usr = $_SESSION['id'];
    $imagen = $_FILES['imagen'];
    
    // 🧹 Borrar imagen anterior si existe
    $anteriores = glob("../img/usuarios/$id_usr.*");
    if (!empty($anteriores)) unlink($anteriores[0]);
    // 🔎 Obtener extensión

    $extension = pathinfo($imagen['name'], PATHINFO_EXTENSION);
    $nombreFinal = $id_usr . '.' . $extension;
    $rutaDestino = "../img/usuarios/" . $nombreFinal;


    // 📦 Mover imagen al servidor
    move_uploaded_file($imagen['tmp_name'], $rutaDestino);

    // 🛠️ Actualizar en base de datos usando DAO
    $cuentaDAO = new CuentaDAO();
    $resultado = $cuentaDAO->actualizarImagenUsuario($id_usr, $nombreFinal);

    echo json_encode($resultado);
}
?>