document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.querySelector('.slides');
  const slides = document.querySelectorAll('.slide');
  let index = 0;

  function showSlide(i) {
      slidesContainer.style.transform = `translateX(-${i * 100}%)`;
  }

  function nextSlide() {
      index = (index + 1) % slides.length;
      showSlide(index);
  }

  setInterval(nextSlide, 5000);
  showSlide(index);

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById("menu");
  const nav = document.querySelector('nav');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        nav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });
  }

  fetch("/recetario/backend/controller/usuario.php")
    .then(res => res.json())
    .then(data => {
      if (data.logueado) {
          const linkUsuario = document.getElementById("linkUsuario");
          document.getElementById("btnLogin").style.display = "none";
          document.getElementById("nombreUsuario").textContent = data.nombre;
          document.getElementById("bienvenida").style.display = "inline";

          linkUsuario.href = "../perfil/perfil.html";
      }
    });
});
