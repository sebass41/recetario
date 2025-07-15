import CuentaDAO from "../../DAO/Cuenta.js";
crearCuenta();

async function crearCuenta() {
  let formElement = document.getElementById("formRegistro");

  formElement.onsubmit = async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeFinal");
    let formData = new FormData(formElement);

    let nombre = formData.get("nombre");
    let email = formData.get("email");
    let contraseña = formData.get("contraseña");

    let cuentaDAO = new CuentaDAO();
    let resultado = await cuentaDAO.crearCuenta(nombre, email, contraseña);

    if (resultado.sucess) {
      formElement.style.display = "none";
      mensaje.style.display = "block";
      mensaje.classList.add("fadeIn");
    } else {
      alert("Error al crear la cuenta: " + resultado.msj);
    }
  };
}
