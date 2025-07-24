<?php
session_start();
require_once "../model/FavoritoDAO.php"; // DAO que gestiona favoritos

$funcion = $_GET['fun']; // Acción solicitada por parámetro

switch ($funcion) {
    case 'agregar':
        agregarFavorito();
        break;
    case 'eliminar':
        eliminarFavorito();
        break;
    case 'obtener':
        obtenerFavoritos();
        break;
    case 'verificar':
        verificarFavorito();
        break;
}

function agregarFavorito() {
    if (!isset($_SESSION['id'])) {
        echo json_encode(new Respuesta(false, "Sesión no válida", null));
        return;
    }

    $id_usuario = $_SESSION['id'];
    $id_receta = $_POST['id_receta'];

    $favoritoDAO = new FavoritoDAO();
    $resultado = $favoritoDAO->agregarFavorito($id_usuario, $id_receta);

    echo json_encode($resultado);
}

function eliminarFavorito() {
    if (!isset($_SESSION['id'])) {
        echo json_encode(new Respuesta(false, "Sesión no válida", null));
        return;
    }

    $id_usuario = $_SESSION['id'];
    $id_receta = $_POST['id_receta'];

    $favoritoDAO = new FavoritoDAO();
    $resultado = $favoritoDAO->eliminarFavorito($id_usuario, $id_receta);

    echo json_encode($resultado);
}

function obtenerFavoritos() {
    if (!isset($_SESSION['id'])) {
        echo json_encode(new Respuesta(false, "Sesión no válida", null));
        return;
    }

    $id_usuario = $_SESSION['id'];

    $favoritoDAO = new FavoritoDAO();
    $resultado = $favoritoDAO->obtenerFavoritosPorUsuario($id_usuario);

    echo json_encode($resultado);
}

function verificarFavorito() {
    if (!isset($_SESSION['id'])) {
        echo json_encode(new Respuesta(false, "Sesión no válida", null));
        return;
    }

    $id_usuario = $_SESSION['id'];
    $id_receta = $_GET['id_receta']; // Puede venir como GET o POST

    $favoritoDAO = new FavoritoDAO();
    $resultado = $favoritoDAO->estaEnFavoritos($id_usuario, $id_receta);

    echo json_encode($resultado);
}
?>