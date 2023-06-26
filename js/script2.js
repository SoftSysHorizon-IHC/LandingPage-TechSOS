//Cambiar idioma
// Obtenemos el botón switch y agregamos un evento de clic
const switchInput = document.getElementById('language-switch');
switchInput.addEventListener('click', function() {
    // Si el switch está seleccionado (en inglés)
    if (switchInput.checked) {
        // Redirigimos al usuario al archivo HTML en inglés
        window.location.href = 'index_en.html';
    } else {
        // Si el switch no está seleccionado (en español)
        // Redirigimos al usuario al archivo HTML en español
        window.location.href = 'index.html';
    }
});



/*Dark Mode Button*/
// Obtén una referencia al botón de modo oscuro
const darkModeButton = document.getElementById('dark-mode-button');

// Agrega un evento click al botón
darkModeButton.addEventListener('click', function () {
    // Obtén una referencia al body
    const body = document.body;

    // Alterna la clase dark-mode en el body
    body.classList.toggle('dark-mode');
});

// Desactiva el modo oscuro al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    body.classList.remove('dark-mode');
});


/*Navbar*/
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('header');
    var benefitsSection = document.querySelector('#precios-techsos');
    var offset = benefitsSection.offsetTop + benefitsSection.offsetHeight + 100; // Ajuste aquí
    var windowHeight = window.innerHeight;
    var scrollPosition = window.scrollY || window.pageYOffset;

    if (scrollPosition >= offset - windowHeight) {
        navbar.style.opacity = '0';
    } else {
        navbar.style.opacity = '1';
    }
});