import RecetaDAO from "../../DAO/Receta.js";

window.onload = async () => {
  // Menú responsive
  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('active');
  });

  // Obtener recetas desde la base de datos
  const recetas = await (new RecetaDAO()).obtenerTodo();

  if (recetas.sucess && recetas.data.length > 0) {
    mostrarRecetas(recetas.data);
  } else {
    document.getElementById('recetas').innerHTML = '<p>No se encontraron recetas.</p>';
  }
};

// ============================
// Mostrar recetas en el grid
// ============================
function mostrarRecetas(lista) {
  const contenedor = document.getElementById('recetas');
  contenedor.innerHTML = ''; // Limpiar contenido anterior

  lista.forEach(receta => {
    const card = document.createElement('div');
    card.classList.add('card');

    // Imagen: usar imagen si hay, si no, una imagen por defecto
    const imagenSrc = receta.img && receta.img !== ""
      ? `../../../backend/img/recetas/${receta.id}.${receta.img}`
      : `../../assets/img/placeholder.png`; // asegúrate de tener esta imagen por defecto

    card.innerHTML = `
      <img src="${imagenSrc}" alt="${receta.nombre}">
      <h3>${receta.nombre}</h3>
      <p>Porciones: ${receta.porciones} - Preparación: ${receta.tiempo_preparación} min</p>
    `;

    contenedor.appendChild(card);
  });
}
