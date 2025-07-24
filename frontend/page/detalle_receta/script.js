import RecetaDAO from "../../DAO/Receta.js";
import FavoritoDAO from "../../DAO/Favorito.js";

document.addEventListener("DOMContentLoaded", async () => {
  const receta = JSON.parse(localStorage.getItem("recetaSeleccionada"));

  if (!receta) {
    document.body.innerHTML = "<p style='padding: 2rem;'>Error: No se encontró la receta seleccionada.</p>";
    return;
  }

  const recetaDAO = new RecetaDAO();
  const favoritoDAO = new FavoritoDAO();

  const respuesta = await recetaDAO.obtenerIngredientesPorId(receta.id);
  const ingredientes = respuesta?.data ?? [];

  // Imagen de receta
  const imagen = document.getElementById("imagen-receta");
  imagen.src = receta.img && receta.img !== ""
    ? `../../../backend/img/recetas/${receta.id}.${receta.img}`
    : "../../assets/img/placeholder.png";
  imagen.alt = receta.nombre;

  // Info básica
  document.getElementById("nombre-receta").textContent = receta.nombre;
  document.getElementById("porciones").textContent = receta.porciones;
  document.getElementById("prep").textContent = `${receta.tiempo_preparación} min`;
  document.getElementById("coccion").textContent = `${receta.tiempo_cocción} min`;

  // Ingredientes
  const listaIngredientes = document.getElementById("ingredientes");
  listaIngredientes.innerHTML = ingredientes.length
    ? ingredientes.map(ing => `<li>${ing.nombre} - ${ing.cantidad} ${ing.unidad}</li>`).join("")
    : "<li>No hay ingredientes disponibles.</li>";

  const mensajeElement = document.createElement("p");
  mensajeElement.innerHTML = `¿Querés convertir alguna medida? Usá nuestro <a href="../convertidor_medidas/convertidor.html">conversor de medidas</a>.`;
  listaIngredientes.appendChild(mensajeElement);

  // Instrucciones
  const pasosTexto = receta.instrucciones ?? "";
  const pasos = pasosTexto
    .split(".")
    .filter(p => p.trim() !== "")
    .map(p => `<li>${p.trim()}.</li>`)
    .join("");
  document.getElementById("instrucciones").innerHTML = pasos || "<li>No hay instrucciones disponibles.</li>";

  // Volver con pliegue
  const btnVolver = document.querySelector(".volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      document.body.classList.add("pliegue");
      setTimeout(() => window.history.back(), 400);
    });
  }

  // Nota y wrapper
  const nota = receta.nota?.trim();
  const popup = document.getElementById("nota-popup");
  const wrapperNota = document.querySelector(".recomendacion-wrapper");
  const iconoNota = document.querySelector(".icono-nota");

  if (nota && nota !== null) {
    popup.textContent = nota;
  } else {
    iconoNota.style.display = "none";
  }

  // Gato favorito
  const gatoFavorito = document.createElement("img");
  gatoFavorito.alt = "Favorito";
  gatoFavorito.className = "gato-favorito";
  gatoFavorito.style.cursor = "pointer";

  const gatoDefault = "../../assets/icon/gato_no_favorito.png";
  const gatoActivo = "../../assets/icon/gato_favorito.png";
  gatoFavorito.src = gatoDefault;
  
  // Si hay nota → insertar antes del iconoNota
  if (nota && receta.nota !== null) {
    wrapperNota.style.display = "flex";
    wrapperNota.insertBefore(gatoFavorito, iconoNota);
  } else {
    iconoNota.style.display = "none";
    wrapperNota.appendChild(gatoFavorito);
  }

  // Verificar si está en favoritos

  if (await verificarFavorito(receta.id)){
    gatoFavorito.src = gatoActivo;
    gatoFavorito.classList.add("activo");
  }


  // Toggle favoritos
  gatoFavorito.addEventListener("click", async () => {
    if (gatoFavorito.classList.contains("activo")) {
      // Eliminar favorito
      await favoritoDAO.eliminarFavorito(receta.id);
      gatoFavorito.src = gatoDefault;
      gatoFavorito.classList.remove("activo");
    } else {
      // Agregar favorito
      await favoritoDAO.agregarFavorito(receta.id);
      gatoFavorito.src = gatoActivo;
      gatoFavorito.classList.add("activo");
    }
  });

  // Nota toggle
  let notaFijada = false;
  iconoNota.addEventListener("click", () => {
    notaFijada = !notaFijada;
    wrapperNota.classList.toggle("fijada", notaFijada);
    iconoNota.classList.toggle("activa", notaFijada);
  });
});

async function verificarFavorito(id) {
  const favoritoDAO = new FavoritoDAO();
  const respuesta = await favoritoDAO.verificarFavorito(id);
  console.log(respuesta.data.favorito);
  return respuesta.data.favorito;
}