const form = document.getElementById("formLogin");
const mensaje = document.getElementById("mensajeLogin");
const passInput = document.getElementById("contraseña");
const toggleBtn = document.getElementById("togglePass");
const icon = document.getElementById("iconGato");

toggleBtn.addEventListener("click", () => {
  const tipo = passInput.type === "password" ? "text" : "password";
  passInput.type = tipo;

  icon.classList.add("cambiando");

  setTimeout(() => {
    icon.src = tipo === "password"
      ? "../../assets/icon/gato-tapado.png"
      : "../../assets/icon/gato-mirando.png";
    icon.alt = tipo === "password" ? "Ocultar contraseña" : "Mostrar contraseña";
    icon.classList.remove("cambiando");
  }, 200);
});