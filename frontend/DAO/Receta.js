import origin from "../config/origin.js";

export default class RecetaDAO {
    async agregar(nombre, cate, tiempoP, tiempoC, porcion, inst, img, ingredientes, cant, unidades, nota){
        let formdata = new FormData();
        formdata.append('nombre', nombre);
        formdata.append("cate", cate);
        formdata.append("tiempoP", tiempoP);
        formdata.append("tiempoC", tiempoC);
        formdata.append("porcion", porcion);
        formdata.append("inst", inst);
        formdata.append("img", img);
        formdata.append("ingr", JSON.stringify(ingredientes));
        formdata.append("cant", JSON.stringify(cant));
        formdata.append("unidades", JSON.stringify(unidades));
        formdata.append("nota", nota);

        let url = origin + "/backend/controller/RecetaController.php?fun=a";
        let config = {
            method: 'POST',
            body: formdata
        }; 

        let response = await fetch(url, config);
        return await response.json();
    }

    async obtenerTodo(){
        let url = origin + "/backend/controller/RecetaController.php?fun=o";
        let response = await fetch(url);

        return await response.json();
    }

    async obtenerIngredientesPorId(recetaId){
        const url = origin + `/backend/controller/RecetaController.php?fun=i&id=${recetaId}`;
        const response = await fetch(url);

        return await response.json();
    }

    async buscarRecetaPorIngrediente(ingredientes){
        let formdata = new FormData();
        formdata.append("ingredientes", JSON.stringify(ingredientes));

        const url = origin + "/backend/controller/RecetaController.php?fun=bi";
        const config = {
            method: "POST",
            body: formdata
        };

        const response = await fetch(url, config);
        return await response.json();
    }

    async obtenerRecetasUsuario(){
        let url = origin + "/backend/controller/RecetaController.php?fun=ou";
        let response = await fetch(url);

        return await response.json();
    }
}

