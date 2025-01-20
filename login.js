document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const accesoBtn = document.querySelector('.btn.animation');

    // Maneja el cambio entre los formularios
    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
    });

    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
    });

    // Redirige a otra página cuando se hace clic en "Acceso"
    accesoBtn.addEventListener('click', () => {
        window.location.href = './Interfaz/interfaz.html'; // Cambia 'otra-pagina.html' por la URL deseada
    });
});
