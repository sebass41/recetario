import SesionDAO from "../../DAO/Sesion.js";

iniciarSesion();

async function iniciarSesion() {
  let formElement = document.getElementById("formLogin");

  formElement.onsubmit = async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeLogin");
    let formData = new FormData(formElement);

    let email = formData.get("email");
    let contraseña = formData.get("contraseña");

    let sesionDAO = new SesionDAO();
    let resultado = await sesionDAO.iniciarSesion(email, contraseña);

    if (resultado.sucess) {
      formElement.style.display = "none";
      mensaje.style.display = "block";
      mensaje.classList.add("salto-alegre");
      setTimeout(() => {
        window.location.href = "../home";
      }, 3000);
    } else {
      alert("Error al iniciar sesión: " + resultado.msj);
    }
  };
}