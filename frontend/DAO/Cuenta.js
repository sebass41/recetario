import origin from "../config/origin.js";

export default class CuentaDAO {
    async crearCuenta(nombre, email, contraseña) {
        let formdata = new FormData();
        formdata.append('nombre', nombre);
        formdata.append('email', email);
        formdata.append('contraseña', contraseña);

        let url = origin + "/backend/controller/CuentaController.php?fun=crearCuenta";
        let config = {
            method: 'POST',
            body: formdata
        };

        let response = await fetch(url, config);
        return await response.json();
    }

    async obtenerUsuario() {
        let url = origin + "/backend/controller/CuentaController.php?fun=getUsr";
        let config = {
            method: 'GET'
        };

        let response = await fetch(url, config);
        return await response.json();
    }

    async cambiarImagen(imagen){
        let formdata = new FormData();
        formdata.append("imagen", imagen);

        let url = origin + "/backend/controller/CuentaController.php?fun=cambiarImagen";
        let config = {
            method: 'POST',
            body: formdata
        };

        let response = await fetch(url, config);
        return await response.json();
    }
}
