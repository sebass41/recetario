import origin from "../config/origin.js";

export default class IngredienteDAO {
    async obtenerEquivalencia(){
        const response = await fetch("../../config/ingredientes_equivalencias.json");
        const data = await response.json();

        return data;
    }
}