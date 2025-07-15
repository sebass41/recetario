import origin from "../config/origin.js";

export default class SesionDAO {
    async iniciarSesion(email, contraseña) {
        let formdata = new FormData();
        formdata.append('email', email);
        formdata.append('contraseña', contraseña);

        let url = origin + "/backend/controller/SesionController.php?fun=iniciarSesion";
        let config = {
            method: 'POST',
            body: formdata
        };

        let response = await fetch(url, config);
        return await response.json();
    }


    async cerrarSesion() {
        const response = await fetch(`${origin}/controller/SesionController.php?fun=cerrarSesion`, {
            method: "POST"
        });

        return await response.json();
    }
}
