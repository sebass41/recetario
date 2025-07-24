<?php

require_once "../conexion/Conexion.php";
require_once "res/Respuesta.php";

ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', 1);
ini_set('error_log', '../log/php_errors.log');

class FavoritoDAO {

    function agregarFavorito($id_usuario, $id_receta) {
        try {
            $connection = conection();
            $sql = "INSERT INTO favoritos (id_usuario, id_receta) VALUES (?, ?) 
                    ON DUPLICATE KEY UPDATE fecha_agregado = CURRENT_TIMESTAMP";

            $stmt = $connection->prepare($sql);
            $stmt->bind_param("ii", $id_usuario, $id_receta);
            $stmt->execute();

            return new Respuesta(true, "Receta agregada a favoritos", null);
        } catch (Exception $e) {
            return new Respuesta(false, "Error al agregar favorito: " . $e->getMessage(), null);
        }
    }

    function eliminarFavorito($id_usuario, $id_receta) {
        try {
            $connection = conection();
            $sql = "DELETE FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("ii", $id_usuario, $id_receta);
            $stmt->execute();

            return new Respuesta(true, "Favorito eliminado correctamente", null);
        } catch (Exception $e) {
            return new Respuesta(false, "Error al eliminar favorito: " . $e->getMessage(), null);
        }
    }

    function obtenerFavoritosPorUsuario($id_usuario) {
        try {
            $connection = conection();
            $sql = "SELECT r.*
                    FROM recetas r
                    JOIN favoritos f ON r.id = f.id_receta
                    WHERE f.id_usuario = ?";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("i", $id_usuario);
            $stmt->execute();
            $result = $stmt->get_result();

            $recetas = $result->fetch_all(MYSQLI_ASSOC);
            return new Respuesta(true, "Favoritos obtenidos correctamente", $recetas);
        } catch (Exception $e) {
            return new Respuesta(false, "Error al obtener favoritos: " . $e->getMessage(), null);
        }
    }

    function estaEnFavoritos($id_usuario, $id_receta) {
        try {
            $connection = conection();
            $sql = "SELECT 1 FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("ii", $id_usuario, $id_receta);
            $stmt->execute();
            $result = $stmt->get_result();

            $existe = $result->num_rows > 0;
            return new Respuesta(true, "Consulta realizada", ["favorito" => $existe]);
        } catch (Exception $e) {
            return new Respuesta(false, "Error al verificar favorito: " . $e->getMessage(), null);
        }
    }
}
?>