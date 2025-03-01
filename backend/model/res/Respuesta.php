<?php

// Definición de la clase Respuesta
class Respuesta{
    public $sucess; // Propiedad para indicar si la operación fue exitosa
    public $msj; // Propiedad para almacenar un mensaje relacionado con la operación
    public $data; // Propiedad para almacenar datos adicionales relacionados con la operación

    // Constructor de la clase Respuesta
    function __construct($sucess, $msj, $data){
        $this->sucess = $sucess; // Inicializa la propiedad sucess
        $this->msj = $msj; // Inicializa la propiedad msj
        $this->data = $data; // Inicializa la propiedad data
    }
}
?>
