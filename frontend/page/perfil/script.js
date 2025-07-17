import CuentaDAO from "../../DAO/Cuenta.js";
import SesionDAO from "../../DAO/Sesion.js";
const cuentaDAO = new CuentaDAO();
const sesionDAO = new SesionDAO();

// Volver
const btnVolver = document.querySelector(".volver");
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    window.history.back();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const datos = await cuentaDAO.obtenerUsuario();
  const usuario = datos?.data;

  if (!usuario) {
    alert("Tenés que iniciar sesión para ver tu perfil 😿");
    window.location.href = "../iniciarSesion/inicioSesion.html";
    return;
  }

  // Cargar datos del usuario
  document.getElementById("nombreUsuario").textContent = usuario.nombre;

  // Fecha formateada (si existe)
  if (usuario.fecha_registro) {
    const fecha = new Date(usuario.fecha_registro).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    document.getElementById("fechaCreacion").textContent = `Miembro desde: ${fecha}`;
  }

  // Foto de perfil con fallback
  const fotoPerfil = document.getElementById("fotoPerfil");
 fotoPerfil.src = usuario.img?.trim()
  ? `../../../backend/img/usuarios/${usuario.img}`
  : "../../assets/icon/gato_login.png";
  fotoPerfil.alt = "Foto de perfil del usuario";

  // Cargar recetas o mostrar mensaje
  const contenedorRecetas = document.getElementById("contenedorRecetas");
  contenedorRecetas.innerHTML = ""; // Limpiar

  if (Array.isArray(usuario.recetas) && usuario.recetas.length > 0) {
    usuario.recetas.forEach(receta => {
      const div = document.createElement("div");
      div.className = "card-receta";
      div.innerHTML = `
        <img src="${receta.img}" alt="${receta.nombre}">
        <h4>${receta.nombre}</h4>
      `;
      contenedorRecetas.appendChild(div);
    });
  } else {
    const mensaje = document.createElement("div");
    mensaje.className = "sin-recetas";
    mensaje.innerHTML = `
      <p>Aún no subiste ninguna receta 😺</p>
      <a href="../agregarReceta/agregarReceta.html" class="agregar-receta">Click aquí para agregar tu primera receta</a>
    `;
    contenedorRecetas.appendChild(mensaje);
  }

  // Cerrar sesión
  const btnCerrar = document.getElementById("cerrar-sesion");
  btnCerrar.addEventListener("click", () => {
    sesionDAO.cerrarSesion().then(() => {
      window.location.href = "../iniciarSesion/inicioSesion.html";
    });
  });
});