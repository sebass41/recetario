import IngredienteDAO from "../../DAO/Ingrediente.js";
let datosIngredientes = await new IngredienteDAO().obtenerEquivalencia();
obtenerForulario();

// Volver
const btnVolver = document.querySelector(".volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      window.history.back(); // Espera 400ms antes de volver
    });
  }
// Poblar datalist con Nombre de ingredientes
const datalistNombre = document.getElementById("listaIngredientes");

if (datalistNombre && datosIngredientes) {
  Object.keys(datosIngredientes).forEach(nombre => {
    const opcion = document.createElement("option");
    opcion.value = nombre;
    datalistNombre.appendChild(opcion);
  });
}
// Poblar datalist con unidad de medida
const unidadesSet = new Set();

// Extraer todas las unidades únicas del JSON
Object.values(datosIngredientes).forEach(info => {
  Object.keys(info.equivalencias).forEach(unidad => unidadesSet.add(unidad));
});

// Agregar también "gramo" manualmente, si querés incluirlo
unidadesSet.add("gramo");

// Poblar el datalist
const datalistUnidades = document.getElementById("listaUnidades");
unidadesSet.forEach(unidad => {
  const opcion = document.createElement("option");
  opcion.value = unidad;
  datalistUnidades.appendChild(opcion);
});

/**
 * Convierte una cantidad entre unidades para un ingrediente.
 * @param {string} ingrediente - El ingrediente a convertir (ej. "harina").
 * @param {number} cantidad - La cantidad ingresada.
 * @param {string} unidadOrigen - Unidad de origen (ej. "gramo", "taza", "cucharada", "cucharadita").
 * @param {string} unidadDestino - Unidad destino.
 * @returns {string} Resultado del cálculo o mensaje de error.
 */
function convertir(ingrediente, cantidad, unidadOrigen, unidadDestino) {
  ingrediente = ingrediente.toLowerCase();
  unidadOrigen = unidadOrigen.toLowerCase();
  unidadDestino = unidadDestino.toLowerCase();

  const datos = datosIngredientes[ingrediente];
  if (!datos) return `❌ Ingrediente "${ingrediente}" no encontrado.`;

  const densidad = datos.densidad_g_ml;
  const equivalencias = datos.equivalencias;

  // Paso 1: convertir a gramos
  let gramos;
  if (unidadOrigen === "gramo") {
    gramos = cantidad;
  } else if (equivalencias[unidadOrigen]) {
    gramos = cantidad * equivalencias[unidadOrigen]; // cantidad × gramos por unidad
  } else {
    return `❌ Unidad de origen "${unidadOrigen}" no válida para "${ingrediente}".`;
  }

  // Paso 2: convertir desde gramos a destino
  let resultado;
  if (unidadDestino === "gramo") {
    resultado = gramos;
  } else if (equivalencias[unidadDestino]) {
    resultado = gramos / equivalencias[unidadDestino]; // gramos ÷ gramos por unidad
  } else {
    return `❌ Unidad de destino "${unidadDestino}" no válida para "${ingrediente}".`;
  }

  return `${cantidad} ${unidadOrigen}(s) de ${ingrediente} equivalen a ${resultado.toFixed(2)} ${unidadDestino}(s).`;
}

function obtenerForulario(){
  let formElement = document.getElementById("formConvercion");

  formElement.onsubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(formElement);

    let ingrediente = formData.get("ingrediente");
    let unidadDestino = formData.get("unidadDestino");
    let unidadOrigen = formData.get("unidadOrigen");
    let cantidad = parseFloat(formData.get("cantidad"));

    const resultado = convertir(ingrediente, cantidad, unidadOrigen, unidadDestino);
    document.getElementById("resultado").textContent = resultado;
  };
}