// Esperar a que la página cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    // Función para mostrar mensajes
    const showMessage = (message, isError = false) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${isError ? 'error-message' : 'success-message'} show`;

        // Remover clases después del tiempo
        setTimeout(() => {
            messageDiv.classList.remove('show');
            messageDiv.classList.remove(isError ? 'error-message' : 'success-message');
        }, 3000);
    };

    // Manejar el envío del formulario de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones básicas
        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', true);
            return;
        }

        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres', true);
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Registro exitoso, iniciando sesión...');

                // Iniciar sesión automáticamente
                const loginResponse = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (loginResponse.ok) {
                    setTimeout(() => {
                        window.location.href = '/interfaz';
                    }, 1500);
                } else {
                    showMessage('Registro exitoso. Por favor, inicia sesión.', true);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            } else {
                showMessage(data.message || 'Error en el registro', true);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error al conectar con el servidor', true);
        }
    });
});
