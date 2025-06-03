import RecetaDAO from "../../DAO/Receta.js";

document.addEventListener("DOMContentLoaded", async () => {
  const receta = JSON.parse(localStorage.getItem("recetaSeleccionada"));

  if (!receta) {
    document.body.innerHTML = "<p style='padding: 2rem;'>Error: No se encontró la receta seleccionada.</p>";
    return;
  }

  // Cargar ingredientes desde la base de datos
  const recetaDAO = new RecetaDAO();
  const respuesta = await recetaDAO.obtenerIngredientesPorId(receta.id);
  const ingredientes = respuesta?.data ?? [];

  // Asignar imagen
  const imagen = document.getElementById("imagen-receta");
  if (receta.img && receta.img !== "") {
    imagen.src = `../../../backend/img/recetas/${receta.id}.${receta.img}`;
  } else {
    imagen.src = "../../assets/img/placeholder.png";
  }
  imagen.alt = receta.nombre;

  // Asignar texto principal
  document.getElementById("nombre-receta").textContent = receta.nombre;
  document.getElementById("porciones").textContent = receta.porciones;
  document.getElementById("prep").textContent = `${receta.tiempo_preparación} min`;
  document.getElementById("coccion").textContent = `${receta.tiempo_cocción} min`;

  // Ingredientes
  const listaIngredientes = document.getElementById("ingredientes");
  listaIngredientes.innerHTML = ingredientes.length
    ? ingredientes.map(ing => `<li>${ing.nombre} - ${ing.cantidad} ${ing.unidad}</li>`).join("")
    : "<li>No hay ingredientes disponibles.</li>";

  // Instrucciones
  const pasosTexto = receta.instrucciones ?? "";
  const pasos = pasosTexto
    .split(".")
    .filter(p => p.trim() !== "")
    .map(p => `<li>${p.trim()}.</li>`)
    .join("");

  document.getElementById("instrucciones").innerHTML = pasos || "<li>No hay instrucciones disponibles.</li>";

  // Efecto de pliegue al volver
  const btnVolver = document.querySelector(".volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      document.body.classList.add("pliegue");
      setTimeout(() => window.history.back(), 400); // Espera 400ms antes de volver
    });
  }
});
