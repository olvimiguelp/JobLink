/**
 * Archivo principal de gestión del perfil de usuario
 * Contiene todas las funcionalidades para editar y gestionar un perfil profesional
 */

// Inicialización del perfil cuando se carga la página
document.addEventListener("DOMContentLoaded", initializeProfile);

// Variable global para controlar el tipo de imagen que se está actualizando (perfil o portada)
let selectedImageType = "";

/**
 * Inicializa el perfil cargando datos guardados y configurando event listeners
 */
function initializeProfile() {
    loadProfileData();
    setupEventListeners();
}

/**
 * Configura todos los event listeners necesarios para la funcionalidad del perfil
 */
function setupEventListeners() {
    // Configuración de listeners para el manejo de imágenes
    document.getElementById("closeBtn").addEventListener("click", closeImagePopup);
    document.getElementById("fileInput").addEventListener("change", handleFileSelect);
    document.getElementById("uploadBtn").addEventListener("click", handleImageUpload);
    
    // Configuración del listener para añadir intereses
    document.querySelector(".add-interest").addEventListener("click", addNewInterest);
}

// ============= FUNCIONES DEL POPUP DE EDICIÓN =============

/**
 * Alterna la visibilidad del popup de edición del perfil
 */
function toggleEditPopup() {
    const editPopup = document.getElementById('editPopup');
    if (editPopup.style.display === 'flex') {
        closeEditPopup();
    } else {
        editPopup.style.display = 'flex';
    }
}

/**
 * Cierra el popup de edición
 */
function closeEditPopup() {
    const popup = document.getElementById('editPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/**
 * Guarda los cambios realizados en el popup de edición
 */
function saveEditPopup() {
    const data = collectFormData();
    updateProfile(data);
    closeEditPopup();
}

// ============= FUNCIONES DE EXPERIENCIA Y EDUCACIÓN =============

/**
 * Añade una nueva entrada de experiencia laboral
 */
function addExperience() {
    const container = document.getElementById('experienceEntries');
    const entryCard = createEntryCard('experience');
    container.appendChild(entryCard);
}

/**
 * Añade una nueva entrada de educación
 */
function addEducation() {
    const container = document.getElementById('educationEntries');
    const entryCard = createEntryCard('education');
    container.appendChild(entryCard);
}

/**
 * Crea una tarjeta de entrada para experiencia o educación
 * @param {string} type - Tipo de entrada ('experience' o 'education')
 * @returns {HTMLElement} - Elemento DOM de la tarjeta creada
 */
function createEntryCard(type) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    
    // Define los campos según el tipo de entrada
    const fields = type === 'experience' ? 
        [
            { label: 'Empresa', name: 'company' },
            { label: 'Cargo', name: 'position' },
            { label: 'Año de entrada', name: 'startYear', type: 'number' },
            { label: 'Año de salida', name: 'endYear', type: 'number' }
        ] :
        [
            { label: 'Institución', name: 'institution' },
            { label: 'Título', name: 'degree' },
            { label: 'Año de entrada', name: 'eduStartYear', type: 'number' },
            { label: 'Año de salida', name: 'eduEndYear', type: 'number' }
        ];

    // Agrega botón de eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => removeEntry(deleteBtn);
    card.appendChild(deleteBtn);

    // Crea los campos del formulario
    fields.forEach(field => {
        const group = createFormGroup(field);
        card.appendChild(group);
    });

    return card;
}

/**
 * Crea un grupo de formulario (label + input)
 * @param {Object} field - Configuración del campo
 * @returns {HTMLElement} - Elemento DOM del grupo de formulario
 */
function createFormGroup(field) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = field.label;

    const input = document.createElement('input');
    input.type = field.type || 'text';
    input.name = field.name;

    group.appendChild(label);
    group.appendChild(input);

    return group;
}

/**
 * Elimina una entrada de experiencia o educación
 */
function removeEntry(button) {
    const entry = button.closest('.entry-card');
    if (entry) {
        entry.remove();
    }
}

// ============= FUNCIONES DE HABILIDADES E IDIOMAS =============

/**
 * Añade una nueva habilidad a la lista
 */
function addSkill() {
    const input = document.getElementById('skillInput');
    const container = document.getElementById('skillsContainer');
    addItem(input, container, 'skill-item');
}

/**
 * Añade un nuevo idioma a la lista
 */
function addLanguage() {
    const input = document.getElementById('languageInput');
    const container = document.getElementById('languagesContainer');
    addItem(input, container, 'language-item');
}

/**
 * Función genérica para añadir items a una lista
 * @param {HTMLElement} input - Elemento de entrada
 * @param {HTMLElement} container - Contenedor donde se añadirá el item
 * @param {string} className - Clase CSS para el nuevo item
 */
function addItem(input, container, className) {
    const value = input.value.trim();
    if (value) {
        const item = document.createElement('div');
        item.className = className;
        item.textContent = value;
        container.appendChild(item);
        input.value = '';
    }
}

// ============= FUNCIONES DE MANEJO DE IMÁGENES =============

/**
 * Abre el popup para subir imágenes
 * @param {string} imageType - Tipo de imagen ('profile' o 'cover')
 */
function openPopup(imageType) {
    selectedImageType = imageType;
    const popup = document.getElementById("popup");
    const imageTypeText = imageType === "profile" ? "foto de perfil" : "foto de portada";
    document.getElementById("image-type").textContent = `Selecciona una nueva ${imageTypeText}.`;
    popup.style.display = "flex";
}

/**
 * Cierra el popup de subida de imágenes
 */
function closeImagePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("fileInput").value = "";
    document.getElementById("uploadBtn").disabled = true;
}

/**
 * Maneja la selección de archivos
 */
function handleFileSelect(event) {
    const fileInput = event.target;
    document.getElementById("uploadBtn").disabled = !fileInput.files.length;
}

/**
 * Procesa la subida de la imagen seleccionada
 */
function handleImageUpload() {
    const file = document.getElementById("fileInput").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (selectedImageType === "profile") {
                updateProfileImage(e.target.result);
            } else if (selectedImageType === "cover") {
                updateCoverPhoto(e.target.result);
            }
            closeImagePopup();
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Actualiza la imagen de perfil
 * @param {string} imageUrl - URL de la imagen
 */
function updateProfileImage(imageUrl) {
    const profileImg = document.querySelector(".nav-profile-img");
    profileImg.src = imageUrl;
    saveToLocalStorage("profileImage", imageUrl);
}

/**
 * Actualiza la foto de portada
 * @param {string} imageUrl - URL de la imagen
 */
function updateCoverPhoto(imageUrl) {
    const coverPhoto = document.querySelector(".cover-photo");
    coverPhoto.style.backgroundImage = `url(${imageUrl})`;
    coverPhoto.style.backgroundSize = "cover";
    coverPhoto.style.backgroundPosition = "center";
    saveToLocalStorage("coverPhoto", imageUrl);
}

// ============= FUNCIONES DE EDICIÓN DE DESCRIPCIÓN =============

/**
 * Muestra el editor de la descripción "Acerca de"
 */
function showEdit() {
    const editContainer = document.getElementById('editContainer');
    const textarea = document.getElementById('aboutTextarea');
    const currentText = document.getElementById('aboutText').textContent;
    textarea.value = currentText;
    editContainer.classList.add('active');
}

/**
 * Cancela la edición de la descripción
 */
function cancelEdit() {
    const editContainer = document.getElementById('editContainer');
    editContainer.classList.remove('active');
}

function updateProfileImage(imageUrl) {
    const profileImg = document.getElementById("profile-img");
    const navProfileImg = document.querySelector(".nav-profile-img");
    
    if (profileImg) profileImg.src = imageUrl;
    if (navProfileImg) navProfileImg.src = imageUrl;
    saveToLocalStorage("profileImage", imageUrl);
}

/**
 * Guarda los cambios en la descripción
 */
function saveEdit() {
    const textarea = document.getElementById('aboutTextarea');
    const aboutText = document.getElementById('aboutText');
    aboutText.textContent = textarea.value;
    cancelEdit();
}

// ============= FUNCIONES DE INTERESES =============

/**
 * Añade un nuevo interés al perfil
 */
function addNewInterest() {
    const newInterest = prompt("Introduce un nuevo interés:");
    if (newInterest?.trim()) {
        const interestTags = document.querySelector(".interest-tags");
        const interestSpan = document.createElement("span");
        interestSpan.className = "interest-tag";
        interestSpan.textContent = newInterest.trim();
        interestTags.appendChild(interestSpan);
        saveToLocalStorage("interests", getInterests());
    }
}

/**
 * Obtiene la lista de intereses actuales
 * @returns {string[]} - Array de intereses
 */
function getInterests() {
    return Array.from(document.querySelectorAll(".interest-tag"))
        .map(tag => tag.textContent);
}

// ============= FUNCIONES DE ACTUALIZACIÓN DEL PERFIL =============

/**
 * Recolecta todos los datos del formulario
 * @returns {Object} - Datos del formulario
 */
function collectFormData() {
    return {
        experience: collectEntries('experienceEntries', ['company', 'position', 'startYear', 'endYear']),
        education: collectEntries('educationEntries', ['institution', 'degree', 'eduStartYear', 'eduEndYear']),
        skills: Array.from(document.getElementById('skillsContainer').children).map(item => item.textContent),
        languages: Array.from(document.getElementById('languagesContainer').children).map(item => item.textContent)
    };
}

/**
 * Recolecta las entradas de un contenedor específico
 * @param {string} containerId - ID del contenedor
 * @param {string[]} fields - Array de campos a recolectar
 * @returns {Object[]} - Array de objetos con los datos recolectados
 */
function collectEntries(containerId, fields) {
    const entries = [];
    document.getElementById(containerId).querySelectorAll('.entry-card').forEach(card => {
        const entry = {};
        fields.forEach(field => {
            entry[field] = card.querySelector(`input[name="${field}"]`).value;
        });
        entries.push(entry);
    });
    return entries;
}

/**
 * Actualiza todas las secciones del perfil
 * @param {Object} data - Datos actualizados del perfil
 */
function updateProfile(data) {
    updateSection('experienceSectionDisplay', data.experience, 
        exp => `<div class="profile-desc-row"><strong>${exp.company}</strong> (${exp.startYear} - ${exp.endYear}): ${exp.position}</div>`);
    
    updateSection('educationSectionDisplay', data.education,
        edu => `<div class="profile-desc-row"><strong>${edu.institution}</strong> (${edu.eduStartYear} - ${edu.eduEndYear}): ${edu.degree}</div>`);
    
    updateContainer('skillsSectionDisplay', data.skills, 'skill-item');
    updateContainer('languagesSectionDisplay', data.languages, 'language-item');
}

/**
 * Actualiza una sección específica del perfil
 * @param {string} sectionId - ID de la sección
 * @param {Object[]} data - Datos para actualizar
 * @param {Function} formatter - Función para formatear cada entrada
 */
function updateSection(sectionId, data, formatter) {
    const section = document.getElementById(sectionId);
    section.innerHTML = data.map(formatter).join('');
}

/**
 * Actualiza un contenedor con items
 * @param {string} containerId - ID del contenedor
 * @param {string[]} items - Items a mostrar
 * @param {string} className - Clase CSS para los items
 */
function updateContainer(containerId, items, className) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map(item => `<span class="${className}">${item}</span>`).join('');
}

// ============= FUNCIONES DE ALMACENAMIENTO LOCAL =============

/**
 * Carga los datos guardados del perfil
 */
function loadProfileData() {
    const profileImage = localStorage.getItem("profileImage");
    const coverPhoto = localStorage.getItem("coverPhoto");
    
    if (profileImage) {
        updateProfileImage(profileImage);
    }
    if (coverPhoto) {
        updateCoverPhoto(coverPhoto);
    }
}

/**
 * Guarda datos en el almacenamiento local
 * @param {string} key - Clave para almacenar
 * @param {any} value - Valor a almacenar
 */
function saveToLocalStorage(key, value) {
    if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}