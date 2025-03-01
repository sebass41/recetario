<?php
header('Access-Control-Allow-Origin: *');
session_start(); // Inicia una nueva sesión o reanuda la existente

require_once "../model/RecetaDAO.php"; // Incluye el archivo PedidoDAO.php, que contiene la clase Pedido

$funcion = $_GET['fun']; // Obtiene el parámetro 'fun' de la URL


switch ($funcion){
    case 'getRecetas':
        getResetas();
        break;
    case 'setReceta':
        setReceta();
        break;
    case 'updateReceta':
        updateReceta();
        break;
    case 'deleteRecetas':
        deleteReceta();
        break;
}

function getResetas(){
    $result = (new RecetaDAO())->getRecetas();
    echo json_encode($result);
}

function setReceta(){
    $nombre = $_POST['nombre'];
    $img = $_FILES['img'];
    $categoria = $_POST['categoria'];
    $t_preparacion = $_POST['t_preparacion'];
    $t_coccion = $_POST['t_coccion'];
    $porciones = $_POST['porciones'];
    $instrucciones = $_POST['instrucciones'];
    $tipo = $_POST['tipo'];

    $result = (new RecetaDAO())->setReceta($nombre, $img, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo);
    echo json_encode($result);
}

function updateReceta(){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $categoria = $_POST['categoria'];
    $t_preparacion = $_POST['t_preparacion'];
    $t_coccion = $_POST['t_coccion'];
    $porciones = $_POST['porciones'];
    $instrucciones = $_POST['instrucciones'];
    $tipo = $_POST['tipo'];

    $result = (new RecetaDAO())->updateReceta($id, $nombre, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo);
    echo json_encode($result);
}

function deleteReceta(){
    $id = $_POST['id'];
    
    $result = (new RecetaDAO())->deleteReceta($id);
    echo json_encode($result);
}
?>