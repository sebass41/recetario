// Archivo: script.js

let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.display = index === slideIndex ? 'block' : 'none';
    });
    slideIndex = (slideIndex + 1) % slides.length;
}

setInterval(showSlides, 3000); // Cambia cada 3 segundos

// Mostrar la primera diapositiva inicialmente
showSlides();
