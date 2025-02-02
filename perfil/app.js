// Configuración de Firebase
const firebaseConfig = {
 
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a la base de datos y autenticación
const db = firebase.database();
const auth = firebase.auth();

// Objeto para almacenar los datos del perfil
let profileData = {
    nombre_usuario: "",
    correo: "",
    url_imagen_perfil: "",
    url_foto_portada: "",
    titular: "",
    descripcion: "",
    experiencias: [],
    educacion: [],
    habilidades: [],
    idiomas: [],
    intereses: []
};

// Función para cargar el perfil
function loadProfile() {
    const user = auth.currentUser;
    if (user) {
        db.ref('usuarios/' + user.uid).once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                profileData = data;
                updateUI();
            }
        });
    }
}

// Función para actualizar la interfaz de usuario
function updateUI() {
    document.getElementById('username').value = profileData.nombre_usuario;
    document.getElementById('email').value = profileData.correo;
    document.getElementById('headline').value = profileData.titular;
    document.getElementById('description').value = profileData.descripcion;
    document.getElementById('profile-image').src = profileData.url_imagen_perfil || "/placeholder.svg";
    document.getElementById('cover-image').src = profileData.url_foto_portada || "/placeholder.svg";

    updateList('experience-list', profileData.experiencias, (exp) => `${exp.cargo} en ${exp.empresa} (${exp.ano_inicio} - ${exp.ano_fin || 'Presente'})`);
    updateList('education-list', profileData.educacion, (edu) => `${edu.titulo} en ${edu.institucion} (${edu.ano_inicio} - ${edu.ano_fin || 'Presente'})`);
    updateList('skills-list', profileData.habilidades);
    updateList('languages-list', profileData.idiomas);
    updateList('interests-list', profileData.intereses);
}

// Función para actualizar listas en la UI
function updateList(elementId, items, formatter = (item) => item) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = formatter(item);
        element.appendChild(li);
    });
}

// Función para agregar experiencia
function addExperience() {
    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const startYear = document.getElementById('start-year').value;
    const endYear = document.getElementById('end-year').value;

    if (company && position && startYear) {
        profileData.experiencias.push({
            empresa: company,
            cargo: position,
            ano_inicio: parseInt(startYear),
            ano_fin: endYear ? parseInt(endYear) : null
        });
        updateUI();
    }
}

// Función para agregar educación
function addEducation() {
    const institution = document.getElementById('institution').value;
    const degree = document.getElementById('degree').value;
    const startYear = document.getElementById('edu-start-year').value;
    const endYear = document.getElementById('edu-end-year').value;

    if (institution && degree && startYear) {
        profileData.educacion.push({
            institucion: institution,
            titulo: degree,
            ano_inicio: parseInt(startYear),
            ano_fin: endYear ? parseInt(endYear) : null
        });
        updateUI();
    }
}

// Función para agregar habilidad
function addSkill() {
    const skill = document.getElementById('skill-input').value;
    if (skill && !profileData.habilidades.includes(skill)) {
        profileData.habilidades.push(skill);
        updateUI();
    }
}

// Función para agregar idioma
function addLanguage() {
    const language = document.getElementById('language-input').value;
    if (language && !profileData.idiomas.includes(language)) {
        profileData.idiomas.push(language);
        updateUI();
    }
}

// Función para agregar interés
function addInterest() {
    const interest = document.getElementById('interest-input').value;
    if (interest && !profileData.intereses.includes(interest)) {
        profileData.intereses.push(interest);
        updateUI();
    }
}

// Función para guardar el perfil
function saveProfile() {
    const user = auth.currentUser;
    if (user) {
        profileData.nombre_usuario = document.getElementById('username').value;
        profileData.correo = document.getElementById('email').value;
        profileData.titular = document.getElementById('headline').value;
        profileData.descripcion = document.getElementById('description').value;

        db.ref('usuarios/' + user.uid).set(profileData)
            .then(() => {
                alert('Perfil guardado exitosamente');
            })
            .catch((error) => {
                console.error('Error al guardar el perfil:', error);
                alert('Error al guardar el perfil');
            });
    } else {
        alert('Debes iniciar sesión para guardar el perfil');
    }
}

// Evento para cargar el perfil cuando se inicia sesión
auth.onAuthStateChanged((user) => {
    if (user) {
        loadProfile();
    } else {
        // Redirigir a la página de inicio de sesión si el usuario no está autenticado
        // window.location.href = 'login.html';
    }
});

// Manejo de subida de imágenes
document.getElementById('profile-image-input').addEventListener('change', function(e) {
    uploadImage(e.target.files[0], 'profile');
});

document.getElementById('cover-image-input').addEventListener('change', function(e) {
    uploadImage(e.target.files[0], 'cover');
});

function uploadImage(file, type) {
    const user = auth.currentUser;
    if (user && file) {
        const storageRef = firebase.storage().ref(`usuarios/${user.uid}/${type}`);
        storageRef.put(file).then(() => {
            return storageRef.getDownloadURL();
        }).then((url) => {
            if (type === 'profile') {
                profileData.url_imagen_perfil = url;
            } else {
                profileData.url_foto_portada = url;
            }
            updateUI();
        }).catch((error) => {
            console.error('Error al subir la imagen:', error);
        });
    }
}
