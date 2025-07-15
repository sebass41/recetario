<?php

require_once "../conexion/Conexion.php"; // Incluye el archivo de conexión a la base de datos
require_once "res/Respuesta.php"; // Incluye el archivo que contiene la clase Respuesta

// Configuración para la gestión de errores
ini_set('display_errors', '0'); // Desactiva la visualización de errores en pantalla
ini_set('display_startup_errors', '0'); // Desactiva la visualización de errores de inicio
ini_set('log_errors', 1); // Activa el registro de errores
ini_set('error_log', '../log/php_errors.log'); // Especifica el archivo de registro de errores

class CuentaDAO {
    function setCuenta($nombre, $email, $contraseña, $origen = 'manual') {
        try {
            $connection = conection();
            $sql = "INSERT INTO usuarios (nombre, email, contraseña, origen) VALUES (?, ?, ?, ?)";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("ssss", $nombre, $email, password_hash($contraseña, PASSWORD_DEFAULT), $origen);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                return new Respuesta(true, "Cuenta creada correctamente", null);
            } else {
                return new Respuesta(false, "Error al crear la cuenta", null);
            }
        } catch (Exception $e) {
            return new Respuesta(false, "Error al crear la cuenta: " . $e->getMessage(), null);
        }
    }
}
?>