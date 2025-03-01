<?php

// Desactiva la visualización de errores en pantalla
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');

// Activa el registro de errores y especifica el archivo de registro
ini_set('log_errors', 1);
ini_set('error_log', '../log/php_errors.log');

// Función para la conexión a la base de datos
function conection (){
    try{
        $host = "localhost"; // Dirección del servidor de base de datos
        $usr = "root"; // Nombre de usuario de la base de datos
        $pass = ""; // Contraseña del usuario de la base de datos
        $bd = "recetario"; // Nombre de la base de datos
        $puerto = 3306; // Puerto de conexión a la base de datos
        $mysqli = new mysqli ($host, $usr, $pass, $bd, $puerto); // Crea una nueva conexión a la base de datos
        return $mysqli; // Devuelve el objeto de conexión
    }catch (Exception $e){
        // Muestra un mensaje de error si la conexión falla
        echo "Se ha producido un error en la Conexión:".$e->getMessage();
    }
}

?>
