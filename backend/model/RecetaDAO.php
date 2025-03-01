<?php

require_once "../conexion/Conexion.php"; // Incluye el archivo de conexión a la base de datos
require_once "res/Respuesta.php"; // Incluye el archivo que contiene la clase Respuesta

// Configuración para la gestión de errores
ini_set('display_errors', '0'); // Desactiva la visualización de errores en pantalla
ini_set('display_startup_errors', '0'); // Desactiva la visualización de errores de inicio
ini_set('log_errors', 1); // Activa el registro de errores
ini_set('error_log', '../log/php_errors.log'); // Especifica el archivo de registro de errores

// Definición de la clase Compra
class RecetaDAO{
    function getRecetas(){
        try{
            $connection = conection();
            $query = "SELECT * FROM recetas";
            
            $result = $connection->query($query);
            $recetas = $result->fetch_all(MYSQLI_ASSOC);
            $msj = "Recetas obtenidas correctamente";
            return new Respuesta(true, $msj, $recetas);
        }catch (Exception $e){
            $msj = "Error al obtener los pedidos: ". $e->getMessage();
            return new Respuesta(false, $msj, null);
        }
    }

    function setReceta($nombre, $img, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo){
        try{
            $connection = conection();
            $query = "INSERT INTO recetas (nombre, categoría_id, tiempo_preparación, tiempo_cocción, porciones, instrucciones, tipo) VALUES (?,?,?,?,?,?,?)";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("sissis", $nombre, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo);
            $stmt->execute();

            $id = $connection->insert_id;
            $rutaTemp = $img['tmp_name'];
            move_uploaded_file($rutaTemp, "../img/$id.png");

            $msj = "Receta agregada correctamente";
            return new Respuesta(true, $msj, null);
        }catch (Exception $e){
            $msj = "Error al agregar la receta: ". $e->getMessage();
            return new Respuesta(false, $msj, null);
        }
    }

    function updateReceta($id, $nombre, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo){
        try{
            $connection = conection();
            $query = "UPDATE recetas SET nombre=?, categoría_id=?, tiempo_preparación=?, tiempo_cocción=?, porciones=?, instrucciones=?, tipo=? WHERE id=?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("sississi", $nombre, $categoria, $t_preparacion, $t_coccion, $porciones, $instrucciones, $tipo, $id);
            $stmt->execute();
            $msj = "Receta modificada correctamente";
            return new Respuesta(true, $msj, null);
        }catch (Exception $e){
            $msj = "Error al modificar la receta: ". $e->getMessage();
            return new Respuesta(false, $msj, null);
        }
    }

    function deleteReceta($id){
        try{
            $connection = conection();
            $query = "DELETE FROM recetas WHERE id=?";
            $stmt = $connection->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $msj = "Receta eliminada correctamente";
            return new Respuesta(true, $msj, null);
        }catch (Exception $e){
            $msj = "Error al eliminar la receta: ". $e->getMessage();
            return new Respuesta(false, $msj, null);
        }
    }

}
?>