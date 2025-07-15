<?php
header('Access-Control-Allow-Origin: *');
session_start(); // Inicia una nueva sesión o reanuda la existente

require_once "../model/RecetaDAO.php"; // Incluye el archivo PedidoDAO.php, que contiene la clase Pedido

$funcion = $_GET['fun']; // Obtiene el parámetro 'fun' de la URL


switch ($funcion){
    case 'o':
        getResetas();
        break;
    case 'a':
        setReceta();
        break;
    case 'updateReceta':
        updateReceta();
        break;
    case 'deleteRecetas':
        deleteReceta();
        break;
    case 'i':
        getIngredientes();
        break;
    case 'bi':
        buscarPorIngrediente();
        break;
}

function getResetas(){
    $result = (new RecetaDAO())->getRecetas();
    echo json_encode($result);
} 

function setReceta(){
    if (!isset($_SESSION['usuario'])) {
        echo json_encode(new Respuesta(false, "Usuario no autenticado", null));
        return;
    }
    $nombre = $_POST['nombre'];
    $img = $_FILES['img'];
    $categoria = $_POST['cate'];
    $t_preparacion = $_POST['tiempoP'];
    $t_coccion = $_POST['tiempoC'];
    $porciones = $_POST['porcion'];
    $instrucciones = $_POST['inst'];
    $nota = $_POST['nota'];
    $ingredientes = json_decode($_POST['ingr']);
    $cantidades = json_decode($_POST['cant']);
    $unidades = json_decode($_POST['unidades']);

    $result = (new RecetaDAO())->setReceta($nombre, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $img, $ingredientes, $cantidades, $unidades, $nota);
    echo json_encode($result);
}

function getIngredientes(){
    $idReceta = $_GET['id'];
    
    $result = (new RecetaDAO())->getIngredientes($idReceta);
    echo json_encode($result);
}

function buscarPorIngrediente(){
    $ingredientes = $_POST['ingredientes'];

    $result = (new RecetaDAO())->buscarPorIngredientes($ingredientes);
    echo json_encode($result);
}

function updateReceta(){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $categoria = $_POST['cate'];
    $t_preparacion = $_POST['tiempoP'];
    $t_coccion = $_POST['tiempoC'];
    $porciones = $_POST['porcion'];
    $instrucciones = $_POST['inst'];
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