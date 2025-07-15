// Simulación de usuario (podés cambiar esto por localStorage o fetch real)
const usuario = {
  nombre: "Sebastián",
  creado: "2023-04-10",
  imagen: "../../assets/icon/usr_icon.png",
  recetas: [
    {
      nombre: "Tarta de Frutilla",
      img: "../../assets/img/tarta-frutilla.jpg"
    },
    {
      nombre: "Pan de ajo",
      img: "../../assets/img/pan-ajo.jpg"
    },
    {
      nombre: "Galletas de avena",
      img: "../../assets/img/galletas-avena.jpg"
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos del usuario
  document.getElementById("nombreUsuario").textContent = usuario.nombre;
  document.getElementById("fechaCreacion").textContent = `Miembro desde: ${usuario.creado}`;
  document.getElementById("fotoPerfil").src = usuario.imagen;

  // Cargar recetas
  const contenedorRecetas = document.getElementById("contenedorRecetas");
  usuario.recetas.forEach(receta => {
    const div = document.createElement("div");
    div.className = "card-receta";
    div.innerHTML = `
      <img src="${receta.img}" alt="${receta.nombre}">
      <h4>${receta.nombre}</h4>
    `;
    contenedorRecetas.appendChild(div);
  });

  // Cerrar sesión
  const btnCerrar = document.getElementById("cerrar-sesion");
  btnCerrar.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../iniciarSesion/inicioSesion.html";
  });
});
