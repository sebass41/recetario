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
    });

    document.getElementById("img").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result; // Mostrar miniatura
        }
        reader.readAsDataURL(file);
    }
});

    
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

function nuevoIngrediente() {
    let conteinerIngr = document.querySelector(".datosIngredientes");

    const divBody = document.createElement("div");
    divBody.className = "body";

    divBody.innerHTML = `
        <input type="text" name="ingredientes[]">
        <input type="number" name="cant[]">
        <input type="text" name="uM[]">
        <button type="button" class="delete-ingr"><img src="../../assets/icon/delete_icon.png" alt="Eliminar Ingrediente" class="img_delete"></button>
    `;

    conteinerIngr.appendChild(divBody);

    actualizarBotonesEliminar();
}

function actualizarBotonesEliminar() {
    const bodies = document.querySelectorAll(".datosIngredientes .body");
    const botonesEliminar = document.querySelectorAll(".delete-ingr");

    botonesEliminar.forEach(boton => {
        boton.removeEventListener("click", eliminarIngrediente); // Evitar duplicados
        boton.addEventListener("click", eliminarIngrediente);
        boton.style.display = (bodies.length > 1) ? "inline-block" : "none";
    });
}

function eliminarIngrediente(e) {
    const bloque = e.target.closest(".body");
    if (!bloque) return;

    // Agregar clase de animación
    bloque.classList.add("removing");

    // Esperar a que termine la animación antes de eliminarlo
    bloque.addEventListener("animationend", () => {
        bloque.remove();
        actualizarBotonesEliminar();
    }, { once: true }); // Se ejecuta una sola vez
}

