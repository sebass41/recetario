<?php

require_once "../conexion/Conexion.php";
require_once "res/Respuesta.php";

// Configuración para la gestión de errores
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', 1);
ini_set('error_log', '../log/php_errors.log');

class SesionDAO {

    public function iniciarSesion($email, $contraseña) {
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
                    $this->guardarSesion($usuario);
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

    public function iniciarSesionGoogle($nombre, $email, $imgUrl) {
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

        // 🖼️ Guardar imagen si no existe localmente
        $idUsuario = $usuario['id_usuario'];
        $nombreArchivo = $idUsuario . ".jpg";
        $rutaDestino = "../img/usuarios/" . $nombreArchivo;

        // Descargar imagen
        $contenido = file_get_contents($imgUrl);
        if ($contenido !== false) {
            file_put_contents($rutaDestino, $contenido);

            // Actualizar ruta en la base de datos
            $sqlUpdateImg = "UPDATE usuarios SET img = ? WHERE id_usuario = ?";
            $stmtUpdate = $connection->prepare($sqlUpdateImg);
            $stmtUpdate->bind_param("si", $nombreArchivo, $idUsuario);
            $stmtUpdate->execute();

            // Actualizar en array también
            $usuario['img'] = $nombreArchivo;
        }

        $this->guardarSesion($usuario);
        return new Respuesta(true, "Inicio de sesión con Google exitoso", $usuario);

    } catch (Exception $e) {
        return new Respuesta(false, "Error al iniciar sesión con Google: " . $e->getMessage(), null);
    }
}

    private function guardarSesion($usuario) {
        session_start();
        $_SESSION['usuario'] = $usuario['nombre'];
        $_SESSION['email'] = $usuario['email'];
        $_SESSION['id'] = $usuario['id_usuario'];
        $_SESSION['origen'] = $usuario['origen'];
    }

    public function cerrarSesion() {
        session_start();
        session_unset();
        session_destroy();
        return new Respuesta(true, "Sesión cerrada correctamente", null);
    }
}