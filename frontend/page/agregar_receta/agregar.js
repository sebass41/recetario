import RecetaDAO from "../../DAO/Receta.js";

window.addEventListener("load", () => {
    agregarReceta();
    actualizarBotonesEliminar();
    
    document.getElementById("menos").addEventListener("click", menosPorcion);
    document.getElementById("mas").addEventListener("click", masPorcion);
    document.getElementById("add").addEventListener("click", nuevoIngrediente);
    document.getElementById("exitButton").addEventListener("click", () => {
        const main = document.querySelector("main");
        main.classList.add("exit-animating");
        setTimeout(() => {
            window.location.href = "../home";
        }, 600);
    });

    document.getElementById("img").addEventListener("change", mostrarMiniatura);
});

// Muestra la miniatura de la imagen seleccionada
function mostrarMiniatura(event) {
    const input = event.target;
    const preview = document.getElementById("preview");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = "../../assets/icon/upload_file.png";
    }
}

// Agrega una nueva fila de ingredientes
function nuevoIngrediente() {
    let conteinerIngr = document.querySelector(".datosIngredientes");

    const divBody = document.createElement("div");
    divBody.className = "body newly-added";

    divBody.innerHTML = `
        <input type="text" name="ingredientes[]" placeholder="Ingrediente">
        <input type="text" name="cant[]" placeholder="Cantidad (ej: 1 o 1/2)">
        <input type="text" name="uM[]" placeholder="Unidad">
        <button type="button" class="delete-ingr">
            <img src="../../assets/icon/delete_icon.png" alt="Eliminar Ingrediente" class="img_delete">
        </button>
    `;

    conteinerIngr.appendChild(divBody);

    setTimeout(() => {
        divBody.classList.remove("newly-added");
    }, 500);

    actualizarBotonesEliminar();
}

// Asocia los botones eliminar con la función correspondiente
function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".delete-ingr");
    botonesEliminar.forEach(boton => {
        boton.onclick = function () {
            this.parentElement.remove();
        };
    });
}

// Envia el formulario con todos los datos de la receta
function agregarReceta() { 
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
        let nota = formData.get("nota");
        let ingredientes = formData.getAll("ingredientes[]");
        let cantidades = formData.getAll("cant[]");
        let unidades = formData.getAll("uM[]");

        let result = await new RecetaDAO().agregar(nombre, cate, tiempoP, tiempoC, porciones, instrucciones, img, ingredientes, cantidades, unidades, nota);

        if (result.sucess) {
            alert("Receta agregada correctamente");
            formElement.reset();
            document.getElementById("preview").src = "../../assets/icon/upload_file.png";

            // Limpiar ingredientes y dejar solo uno vacío
            const bodies = document.querySelectorAll(".datosIngredientes .body");
            bodies.forEach((body, i) => {
                if (i === 0) {
                    body.querySelectorAll("input").forEach(input => input.value = "");
                } else {
                    body.remove();
                }
            });

            actualizarBotonesEliminar();
        } else {
            alert(result.msj);
        }
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
