<?php

require_once "../conexion/Conexion.php"; // Incluye el archivo de conexión a la base de datos
require_once "res/Respuesta.php"; // Incluye el archivo que contiene la clase Respuesta

// Configuración para la gestión de errores
ini_set('display_errors', '0'); // Desactiva la visualización de errores en pantalla
ini_set('display_startup_errors', '0'); // Desactiva la visualización de errores de inicio
ini_set('log_errors', 1); // Activa el registro de errores
ini_set('error_log', '../log/php_errors.log'); // Especifica el archivo de registro de errores

class CuentaDAO {
    function setCuenta($nombre, $email, $contraseña) {
        try {
            $connection = conection();
            $sql = "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("sss", $nombre, $email, password_hash($contraseña, PASSWORD_DEFAULT));
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

    function iniciarSesion($email, $contraseña) {
        try {
            $connection = conection();
            $sql = "SELECT * FROM usuarios WHERE email = ?";
            $stmt = $connection->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $usuario = $result->fetch_assoc();
                if (password_verify($contraseña, $usuario['contraseña'])) {
                    return new Respuesta(true, "Inicio de sesión exitoso", $usuario);
                } else {
                    return new Respuesta(false, "Contraseña incorrecta", null);
                }
            } else {
                return new Respuesta(false, "Usuario no encontrado", null);
            }
        } catch (Exception $e) {
            return new Respuesta(false, "Error al iniciar sesión: " . $e->getMessage(), null);
        }
    }
    function iniciarSesionGoogle($nombre, $email) {
        try {
            $connection = conection();

            // Buscar si ya existe
            $sqlBuscar = "SELECT * FROM usuarios WHERE email = ?";
            $stmtBuscar = $connection->prepare($sqlBuscar);
            $stmtBuscar->bind_param("s", $email);
            $stmtBuscar->execute();
            $result = $stmtBuscar->get_result();

            if ($result->num_rows > 0) {
                $usuario = $result->fetch_assoc();
            } else {
                // Insertar nuevo usuario sin contraseña
                $sqlInsert = "INSERT INTO usuarios (nombre, email, origen) VALUES (?, ?, 'google')";
                $stmtInsert = $connection->prepare($sqlInsert);
                $stmtInsert->bind_param("ss", $nombre, $email);
                $stmtInsert->execute();

                if ($stmtInsert->affected_rows === 0) {
                    return new Respuesta(false, "No se pudo crear el usuario", null);
                }

                // Buscar el usuario recién creado
                $stmtBuscar->execute();
                $result = $stmtBuscar->get_result();
                $usuario = $result->fetch_assoc();
            }

            // Iniciar sesión
            session_start();
            $_SESSION['usuario'] = $usuario['nombre'];
            $_SESSION['email'] = $usuario['email'];

            return new Respuesta(true, "Inicio de sesión con Google exitoso", $usuario);
        } catch (Exception $e) {
            return new Respuesta(false, "Error al iniciar sesión con Google: " . $e->getMessage(), null);
        }
    }
}
?>