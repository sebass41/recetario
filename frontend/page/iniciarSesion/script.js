import CuentaDAO from "../../DAO/Cuenta.js";

async function iniciarSesion() {
  let formElement = document.getElementById("formLogin");

  formElement.onsubmit = async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeFinal");
    let formData = new FormData(formElement);

    let email = formData.get("email");
    let contraseña = formData.get("contraseña");

    let cuentaDAO = new CuentaDAO();
    let resultado = await cuentaDAO.iniciarSesion(email, contraseña);

    if (resultado.sucess) {
      formElement.style.display = "none";
      mensaje.style.display = "block";
      mensaje.classList.add("fadeIn");
      setTimeout(() => {
        window.location.href = "../home";
      }, 5000);
    } else {
      alert("Error al iniciar sesión: " + resultado.msj);
    }
  };
}