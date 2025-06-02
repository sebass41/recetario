import RecetaDAO from "../../DAO/Receta.js";

window.onload = ()=>{
    agregarReceta();

    document.querySelector(".menos").addEventListener("click", e =>{
        menosPorcion();
    });
    document.querySelector(".mas").addEventListener("click", e =>{
        masPorcion();
    });
    document.querySelector("#add").addEventListener("click", e =>{
        nuevoIngrediente();
    })
    
}

async function agregarReceta() {
    let formElement = document.querySelector("#formReceta");

    formElement.onsubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(formElement);
        let nombre = formData.get("nombre");
        let cate = formData.get("cate");
        let tiempoP = formData.get("tiempoP");
        let tiempoC = formData.get("tiempoC");
        let porciones = formData.get("porcion");
        let instrucciones = formData.get("inst");
        let img = formData.get("img");
        let ingredientes = formData.getAll("ingredientes[]");
        let cantidades = formData.getAll("cant[]");
        let unidades = formData.getAll("uM[]");

        let result = await new RecetaDAO().agregar(nombre, cate, tiempoP, tiempoC, porciones, instrucciones, img, ingredientes, cantidades, unidades);
        
        console.log(result);
    }
}

function masPorcion(){
    let input = document.getElementById("porcion");
    let valor = parseInt(input.value) || 0;
    input.value = valor + 1;
}

function menosPorcion(){
     let input = document.getElementById("porcion");
    let valor = parseInt(input.value) || 0;
    if (valor > 1) input.value = valor - 1;
}

function nuevoIngrediente(){
    let conteinerIngr = document.querySelector(".datosIngredientes");
    let divBody = document.createElement("div");
    divBody.className = "body";
    
    divBody.innerHTML = `
        <div class="body">
                    <input type="text" name="ingredientes[]"">
                    <input type="number" name="cant[]">
                    <input type="text" name="uM[]">
                </div>
    `;

    conteinerIngr.appendChild(divBody);
}