import CuentaDAO from "../../DAO/Cuenta.js";
import SesionDAO from "../../DAO/Sesion.js";
import RecetaDAO from "../../DAO/Receta.js";
const cuentaDAO = new CuentaDAO();
const sesionDAO = new SesionDAO();
const recetaDAO = new RecetaDAO();

const recetasUsuario = await recetaDAO.obtenerRecetasUsuario();
const usuario = await cuentaDAO.obtenerUsuario();

// Veriicar si hay sesión activa
if (!usuario) {
  window.location.href = "../iniciarSesion/inicioSesion.html";
}

// Volver
const btnVolver = document.querySelector(".volver");
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    window.history.back();
  });
}

// Cargar datos del usuario
mostrarDatosUsuario(usuario.data);

// Cargar recetas del usuario
mostrarRecetas(recetasUsuario.data);


// Cerrar sesión
cerrarSesion();

// Cambiar imagen de perfil
cambioImagenPerfil();

// Funciones y eventos
function mostrarRecetas(recetas) {
  console.log("Recetas a mostrar:", recetas);
  const contenedorRecetas = document.getElementById("contenedorRecetas");
  contenedorRecetas.innerHTML = ""; // Limpiar
  console.log(recetas);
  if (recetas === null) {
    const mensaje = document.createElement("div");
    mensaje.className = "sin-recetas";
    mensaje.innerHTML = `
      <p>Aún no subiste ninguna receta 😺</p>
      <a href="../agregarReceta/agregarReceta.html" class="agregar-receta">Click aquí para agregar tu primera receta</a>
    `;
    contenedorRecetas.appendChild(mensaje);
    return;
  }

  recetas.forEach(receta => {
    const div = document.createElement("div");
    div.className = "card-receta";
    div.innerHTML = `
    <img src="../../../backend/img/recetas/${receta.id}.${receta.img}" alt="${receta.nombre}">
    <h3>${receta.nombre}</h3>
    `;
    contenedorRecetas.appendChild(div);
  });

}

function mostrarDatosUsuario(usuario) {
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
}

function cerrarSesion(){
  const btnCerrar = document.getElementById("cerrar-sesion");
  btnCerrar.addEventListener("click", () => {
    sesionDAO.cerrarSesion().then(() => {
      window.location.href = "../iniciarSesion/inicioSesion.html";
    });
  });
}

async function cambioImagenPerfil() {
  const fotoPerfil = document.getElementById("fotoPerfil");
  const selectorImagen = document.getElementById("selectorImagen");

  // Al pasar el mouse, simulamos clic en el input
  fotoPerfil.addEventListener("mouseenter", () => {
    fotoPerfil.style.cursor = "pointer";
  });

  fotoPerfil.addEventListener("click", () => {
    selectorImagen.click();
  });

  // Cuando se selecciona una nueva imagen
  selectorImagen.addEventListener("change", async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    // Mostrar la nueva imagen de forma inmediata (visual, no aún en backend)
    const urlTemporal = URL.createObjectURL(archivo);
    fotoPerfil.src = urlTemporal;

    // Subir al backend (ajustá ruta según tu estructura)
    let respuesta = await cuentaDAO.cambiarImagen(archivo);
    console.log(respuesta);

    if (respuesta.sucess) {
      console.log("Imagen de perfil actualizada correctamente");
    } else {
      console.error("Error al actualizar la imagen de perfil:", respuesta.msj);
    }
  });
}