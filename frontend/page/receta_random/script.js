import RecetaDAO from "../../DAO/Receta.js";

const carrusel = document.getElementById("carrusel");
const nombreFinal = document.getElementById("nombreReceta");
const imagenFinal = document.getElementById("imagenReceta");

const recetaDAO = new RecetaDAO();
const response = await recetaDAO.getRecetasAleatorias(); // Obtener recetas aleatorias
const recetas = response.data; 

// Cargar recetas visuales en el carrusel
recetas.forEach(receta => {
  const div = document.createElement("div");
  const urlImg = `../../../backend/img/recetas/${receta.id}.${receta.img}`;
  div.className = "item";
  div.innerHTML = `
    <img src="${urlImg}" alt="${receta.nombre}">
    <p>${receta.nombre}</p>
  `;
  carrusel.appendChild(div);
});

// Efecto de giro que va frenando
let desplazamiento = 0;
let velocidad = 50;
let interval;

// Volver
const btnVolver = document.querySelector(".volver");
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    window.history.back();
  });
}

function seleccionarReceta() {
  const seleccion = recetas[Math.floor(Math.random() * recetas.length)];
  nombreFinal.textContent = seleccion.nombre;
  imagenFinal.src = `../../../backend/img/recetas/${seleccion.id}.${seleccion.img}`;
  imagenFinal.classList.add("destacada");
  imagenFinal.style.display = "block";

  setTimeout(() => {
    imagenFinal.classList.add("mostrar");
  }, 200); // Delay para que la transición se note

  // Ocultar carrusel y gato
  carrusel.style.display = "none";
  document.querySelector(".gato-animado").style.display = "none";

  // Mostrar botones
  document.querySelector(".botones").style.display = "flex";

  // Botón ver receta (redirige si tenés URL asociada)
  document.getElementById("verRecetaBtn").onclick = () => {
    localStorage.setItem('recetaSeleccionada', JSON.stringify(seleccion));
    window.location.href = "../detalle_receta/detalle_receta.html";
  };

  // Botón girar de nuevo
  document.getElementById("girarDeNuevoBtn").onclick = () => {
    location.reload();
  };
}

// Sonido de ruleta
const sonidoRuleta = new Audio("../../assets/sound/ruleta.mp3");

function girarCarrusel() {
  sonidoRuleta.play();
  interval = setInterval(() => {
    desplazamiento += velocidad;
    carrusel.style.transform = `translateX(-${desplazamiento}px)`;
    if (velocidad > 0.5) {
      velocidad *= 0.95;
    } else {
      clearInterval(interval);
      sonidoRuleta.pause();
      seleccionarReceta();
    }
  }, 30);
}

// Iniciar el sonido al hacer clic en cualquier parte de la página
document.body.addEventListener("click", () => {
  if (sonidoRuleta.paused) {
    sonidoRuleta.play().catch(e => console.log("Audio bloqueado:", e));
  }
}, { once: true }); // solo la primera vez
girarCarrusel();