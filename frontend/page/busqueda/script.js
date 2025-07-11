import RecetaDAO from "../../DAO/Receta.js";
let todasLasRecetas = []

window.addEventListener("load", () => {
    configurarBuscador();
    const btnVolver = document.querySelector(".volver");
    if (btnVolver) {
      btnVolver.addEventListener("click", () => {
        document.body.classList.add("pliegue");
        setTimeout(() => window.history.back(), 400); // Espera 400ms antes de volver
      });
    }
});

function configurarBuscador() {
    const input = document.getElementById("input-ingrediente");
    const btnBuscar = document.getElementById("btn-buscar");
    const lista = document.getElementById("ingredientes-lista");
    const wrapper = document.querySelector(".buscador-wrapper");
    const seccion = document.querySelector(".buscador-seccion");

    const ingredientes = [];

    btnBuscar.addEventListener("click", () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor || ingredientes.includes(valor)) return;

        if (!wrapper.classList.contains("mini")) {
            wrapper.classList.add("mini");
            seccion.classList.add("mini");
        }

        const tag = document.createElement("div");
        tag.className = "ingrediente-tag";
        tag.innerHTML = `<span>${valor}</span><button>&times;</button>`;

        tag.querySelector("button").addEventListener("click", () => {
            tag.remove();
            const index = ingredientes.indexOf(valor);
            if (index !== -1) ingredientes.splice(index, 1);
            buscarRecetas(ingredientes);
        });

        lista.appendChild(tag);
        ingredientes.push(valor);
        input.value = '';

        buscarRecetas(ingredientes);
    });
}

// 🔍 Envia los ingredientes al backend y actualiza los resultados
async function buscarRecetas(ingredientes) {
    let recetas = await new RecetaDAO().buscarRecetaPorIngrediente(ingredientes);
    
    if (recetas && recetas.sucess) {
        todasLasRecetas = recetas.data;
        mostrarRecetas(todasLasRecetas);
        activarDetalleReceta();
    } else {
        mostrarError(recetas?.msj || "Error al buscar recetas");
    }
}

// 🧾 Muestra las recetas recibidas
function mostrarRecetas(data) {
    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron recetas con esos ingredientes.</p>";
        return;
    }

    data.forEach(receta => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.id = receta.id;

      const imagenSrc = receta.img && receta.img !== ""
        ? `../../../backend/img/recetas/${receta.id}.${receta.img}`
        : `../../assets/img/placeholder.png`;

      card.innerHTML = `
        <img src="${imagenSrc}" alt="${receta.nombre}">
        <h3>${receta.nombre}</h3>
        <p>Porciones: ${receta.porciones} - Preparación: ${receta.tiempo_preparación} min</p>
      `;

      contenedor.appendChild(card);
    });

    activarDetalleReceta();
}

function activarDetalleReceta() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      // Agrega clase de animación manual si querés otro efecto
      card.style.transform = 'scale(0.97)';
      card.style.transition = 'transform 0.2s ease';

      const id = card.dataset.id;
      const receta = todasLasRecetas.find(r => r.id == id);
      if (receta) {
        localStorage.setItem('recetaSeleccionada', JSON.stringify(receta));

        // Espera la animación antes de redirigir
        setTimeout(() => {
          window.location.href = '../detalle_receta/detalle_receta.html';
        }, 180); // Tiempo de la animación en milisegundos
      }
    });
  });
}