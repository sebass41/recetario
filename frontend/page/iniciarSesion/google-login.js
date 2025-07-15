function handleCredentialResponse(response) {
          const token = response.credential;

          // 🐾 Podés ver el token en consola para verificar
          console.log("Token JWT recibido:", token);

          // Enviamos el token al servidor para validación (usando fetch)
          fetch("/recetario/backend/controller/cuentaController.php?fun=iniciarSesionGoogle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential })
        })
          .then(res => res.json())
          .then(data => {
            if (data.sucess) {
                form.style.display = "none";
                mensaje.style.display = "block";
                mensaje.classList.add("salto-alegre");
              setTimeout(() => {
                window.location.href = "../home";
              }, 5000);
            } else {
              alert("Error al iniciar sesión con Google 😿");
              console.log(data.sucess);
            }
          })
    .catch(err => {
    alert("Ocurrió un error al contactar el servidor");
    console.error(err);
    });
}