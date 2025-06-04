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
        
    function setReceta($nombre, $categoria_id, $tiempo_preparacion, $tiempo_coccion, $porciones, $instrucciones, $img, $ingredientes, $cantidades, $unidades, $nota) {
        try {
            $connection = conection();

            // Obtener el nombre y extensión de la imagen
            $nomImg = $img['name'];
            $extension = pathinfo($nomImg, PATHINFO_EXTENSION);

            // Insertar en tabla recetas
            $sql = "INSERT INTO recetas (nombre, categoría_id, tiempo_preparación, tiempo_cocción, porciones, instrucciones, img, nota) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("siiiisss", $nombre, $categoria_id, $tiempo_preparacion, $tiempo_coccion, $porciones, $instrucciones, $extension, $nota);
            $stmt->execute();

            // Obtener el ID de la receta insertada
            $receta_id = $connection->insert_id;

            // Mover la imagen al directorio de destino
            $rutaTemp = $img['tmp_name'];
            move_uploaded_file($rutaTemp, "../img/recetas/$receta_id.$extension");

            // Insertar ingredientes
            $sqlIng = "INSERT INTO recetas_ingredientes (receta_id, ingrediente_id, cantidad, unidad) VALUES (?, ?, ?, ?)";
            $stmtIng = $connection->prepare($sqlIng);

            for ($i = 0; $i < count($ingredientes); $i++) {
                $nombreIngrediente = $ingredientes[$i];
                $cantidad = $cantidades[$i];
                $unidad = $unidades[$i];

                // Buscar si el ingrediente ya existe
                $sqlBuscar = "SELECT id FROM ingredientes WHERE nombre = ?";
                $stmtBuscar = $connection->prepare($sqlBuscar);
                $stmtBuscar->bind_param("s", $nombreIngrediente);
                $stmtBuscar->execute();
                $resultado = $stmtBuscar->get_result();

                if ($fila = $resultado->fetch_assoc()) {
                    $ingrediente_id = $fila['id'];
                } else {
                    // Si no existe, lo insertamos
                    $sqlInsertIng = "INSERT INTO ingredientes (nombre) VALUES (?)";
                    $stmtInsertIng = $connection->prepare($sqlInsertIng);
                    $stmtInsertIng->bind_param("s", $nombreIngrediente);
                    $stmtInsertIng->execute();
                    $ingrediente_id = $stmtInsertIng->insert_id;
                }

                // Insertamos la relación con la receta
                $stmtIng->bind_param("iiis", $receta_id, $ingrediente_id, $cantidad, $unidad);
                $stmtIng->execute();
            }

            $msj = "Receta e ingredientes insertados correctamente.";
            return new Respuesta(true, $msj, []);
        } catch (Exception $e) {
            $msj = "Error: " . $e->getMessage();
            return new Respuesta(false, $msj, []);
        }
    }

    function getIngredientes($id){
        try{
            $connection = conection();
            $sql = "SELECT i.nombre, ri.cantidad, ri.unidad
                    FROM recetas_ingredientes ri
                    JOIN ingredientes i ON ri.ingrediente_id = i.id
                    WHERE ri.receta_id = ?";

            $stmt = $connection->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $resultado = $stmt->get_result();
            $ingredientes = $resultado->fetch_all(MYSQLI_ASSOC);

            $msj = "Obtenido correctamente";
            return new Respuesta(true, $msj, $ingredientes);
        }catch (Exception $e){
            $msj = "Error: ". $e->getMessage();
            return new Respuesta(false, $msj, []);
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