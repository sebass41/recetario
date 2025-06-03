import RecetaDAO from "../../DAO/Receta.js";

let todasLasRecetas = [];
let categoriaSeleccionada = "0";
let textoBusqueda = "";

window.onload = async () => {
  // Menú responsive
  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('active');
  });

  // Obtener recetas desde la base de datos
  const recetas = await (new RecetaDAO()).obtenerTodo();

  if (recetas.sucess && recetas.data.length > 0) {
    todasLasRecetas = recetas.data;
    mostrarRecetasFiltradas();
    activarFiltroPorCategoria();
    activarBuscador();
    activarDetalleReceta();
  } else {
    document.getElementById('recetas').innerHTML = '<p>No se encontraron recetas.</p>';
  }
};

// Mostrar recetas en el grid
function mostrarRecetas(lista) {
  const contenedor = document.getElementById('recetas');
  contenedor.innerHTML = ''; // Limpiar contenido anterior

  if (lista.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron recetas.</p>';
    return;
  }

  lista.forEach(receta => {
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

  // Vuelve a activar los eventos de click
  activarDetalleReceta();
}

// Filtrar y mostrar según búsqueda + categoría
function mostrarRecetasFiltradas() {
  const filtradas = todasLasRecetas.filter(receta => {
    const coincideCategoria = categoriaSeleccionada === "0" || receta["categoría_id"] === categoriaSeleccionada;
    const coincideTexto = receta.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });

  mostrarRecetas(filtradas);
}

// Activar botones de categoría
function activarFiltroPorCategoria() {
  const botones = document.querySelectorAll('.lista-categorias button');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      // Estilo botón activo
      botones.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');

      // Cambiar categoría seleccionada y mostrar recetas filtradas
      categoriaSeleccionada = btn.getAttribute('data-cat');
      mostrarRecetasFiltradas();
    });
  });
}

// Activar buscador
function activarBuscador() {
  const input = document.getElementById('buscar');
  const boton = document.querySelector('.buscador button');

  // Buscar al escribir
  input.addEventListener('input', () => {
    textoBusqueda = input.value;
    mostrarRecetasFiltradas();
  });

  // O al hacer clic en "Buscar"
  boton.addEventListener('click', () => {
    textoBusqueda = input.value;
    mostrarRecetasFiltradas();
  });
}

// 👉 Nueva función: activar redirección a detalle
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

