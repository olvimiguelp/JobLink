// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFCss8GvV6UNMAE55ZWSI1bRembSopKGA",
  authDomain: "joblink-86307.firebaseapp.com",
  databaseURL: "https://joblink-86307-default-rtdb.firebaseio.com",
  projectId: "joblink-86307",
  storageBucket: "joblink-86307.firebasestorage.app",
  messagingSenderId: "787248934984",
  appId: "1:787248934984:web:ebe4dac6a0ba4b67f9287d",
  measurementId: "G-Z769XPNNLP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let selectedImageType = "";
let interests = ["programación"];

document.addEventListener("DOMContentLoaded", initializeProfile);

function initializeProfile() {
  loadProfileData();
  setupEventListeners();
  updateInterestTags();
}

function setupEventListeners() {
  document.getElementById("closeBtn").addEventListener("click", closeImagePopup);
  document.getElementById("fileInput").addEventListener("change", handleFileSelect);
  document.getElementById("uploadBtn").addEventListener("click", handleImageUpload);
  document.getElementById("addInterestBtn").addEventListener("click", () => {
    document.getElementById("modal").style.display = "block";
    updateCurrentInterests();
  });
  document.getElementById("saveInterest").addEventListener("click", saveNewInterest);
  window.onclick = (event) => {
    if (event.target == document.getElementById("modal")) {
      document.getElementById("modal").style.display = "none";
    }
  };
}

function toggleEditPopup() {
  const editPopup = document.getElementById("editPopup");
  editPopup.style.display = editPopup.style.display === "flex" ? "none" : "flex";
}

function closeEditPopup() {
  document.getElementById("editPopup").style.display = "none";
}

function saveEditPopup() {
  const data = collectFormData();
  updateProfile(data);
  updateProfileInfo();
  saveProfileData(data);
  saveToLocalStorage("profileName", data.name);
  saveToLocalStorage("profileHeadline", data.headline);
  closeEditPopup();
}

function addExperience() {
  const container = document.getElementById("experienceEntries");
  const entryCard = createEntryCard("experience");
  container.appendChild(entryCard);
}

function addEducation() {
  const container = document.getElementById("educationEntries");
  const entryCard = createEntryCard("education");
  container.appendChild(entryCard);
}

function createEntryCard(type) {
  const card = document.createElement("div");
  card.className = "entry-card";
  const fields = type === "experience"
    ? [
        { label: "Empresa", name: "company" },
        { label: "Cargo", name: "position" },
        { label: "Año de entrada", name: "startYear", type: "number" },
        { label: "Año de salida", name: "endYear", type: "number" },
      ]
    : [
        { label: "Institución", name: "institution" },
        { label: "Título", name: "degree" },
        { label: "Año de entrada", name: "eduStartYear", type: "number" },
        { label: "Año de salida", name: "eduEndYear", type: "number" },
      ];
  
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.onclick = () => removeEntry(deleteBtn);
  card.appendChild(deleteBtn);
  
  fields.forEach((field) => {
    const group = createFormGroup(field);
    card.appendChild(group);
  });

  return card;
}

function createFormGroup(field) {
  const group = document.createElement("div");
  group.className = "form-group";

  const label = document.createElement("label");
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = field.type || "text";
  input.name = field.name;

  group.appendChild(label);
  group.appendChild(input);

  return group;
}

function removeEntry(button) {
  const entry = button.closest(".entry-card");
  if (entry) {
    entry.remove();
  }
}

function addSkill() {
  const input = document.getElementById("skillInput");
  const container = document.getElementById("skillsContainer");
  addItem(input, container, "skill-item");
}

function addLanguage() {
  const input = document.getElementById("languageInput");
  const container = document.getElementById("languagesContainer");
  addItem(input, container, "language-item");
}

function addItem(input, container, className) {
  const value = input.value.trim();
  if (value) {
    const item = document.createElement("div");
    item.className = className;
    item.textContent = value;
    container.appendChild(item);
    input.value = "";
  }
}

function openPopup(imageType) {
  selectedImageType = imageType;
  const popup = document.getElementById("popup");
  const imageTypeText = imageType === "profile" ? "foto de perfil" : "foto de portada";
  document.getElementById("image-type").textContent = `Selecciona una nueva ${imageTypeText}.`;
  popup.style.display = "flex";
}

function closeImagePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("fileInput").value = "";
  document.getElementById("uploadBtn").disabled = true;
}

function handleFileSelect(event) {
  const fileInput = event.target;
  document.getElementById("uploadBtn").disabled = !fileInput.files.length;
}

function handleImageUpload() {
  const file = document.getElementById("fileInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
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

function updateProfileImage(imageUrl) {
  const profileImg = document.getElementById("profile-img");
  const navProfileImg = document.querySelector(".nav-profile-img");

  if (profileImg) profileImg.src = imageUrl;
  if (navProfileImg) navProfileImg.src = imageUrl;
  saveToLocalStorage("profileImage", imageUrl);
}

function updateCoverPhoto(imageUrl) {
  const coverPhoto = document.querySelector(".cover-photo");
  coverPhoto.style.backgroundImage = `url(${imageUrl})`;
  coverPhoto.style.backgroundSize = "cover";
  coverPhoto.style.backgroundPosition = "center";
  saveToLocalStorage("coverPhoto", imageUrl);
}

function showEdit() {
  const editContainer = document.getElementById("editContainer");
  const textarea = document.getElementById("aboutTextarea");
  const currentText = document.getElementById("aboutText").textContent;
  textarea.value = currentText;
  editContainer.classList.add("active");
}

function cancelEdit() {
  const editContainer = document.getElementById("editContainer");
  editContainer.classList.remove("active");
}

function saveEdit() {
  const textarea = document.getElementById("aboutTextarea");
  const aboutText = document.getElementById("aboutText");
  aboutText.textContent = textarea.value;
  cancelEdit();
  saveToLocalStorage("aboutText", textarea.value);
}

function updateInterestTags() {
  const interestTags = document.getElementById("interestTags");
  interestTags.innerHTML = "";
  interests.forEach((interest) => {
    const span = document.createElement("span");
    span.className = "interest-tag";
    span.textContent = interest;
    interestTags.appendChild(span);
  });
}

function updateCurrentInterests() {
  const currentInterests = document.getElementById("currentInterests");
  currentInterests.innerHTML = "";
  interests.forEach((interest) => {
    const div = document.createElement("div");
    div.className = "interest-item";
    div.textContent = interest;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.className = "remove-interest";
    removeBtn.onclick = () => removeInterest(interest);
    div.appendChild(removeBtn);
    currentInterests.appendChild(div);
  });
}

function addInterest(interest) {
  if (interest && !interests.includes(interest)) {
    interests.push(interest);
    updateInterestTags();
    updateCurrentInterests();
    saveToLocalStorage("interests", JSON.stringify(interests));
  }
}

function removeInterest(interest) {
  interests = interests.filter((i) => i !== interest);
  updateInterestTags();
  updateCurrentInterests();
  saveToLocalStorage("interests", JSON.stringify(interests));
}

function saveNewInterest() {
  const newInterest = document.getElementById("newInterest").value.trim();
  if (newInterest) {
    addInterest(newInterest);
    document.getElementById("newInterest").value = "";
  }
  document.getElementById("modal").style.display = "none";
}

function collectFormData() {
  return {
    name: document.getElementById("profileNameInput").value,
    headline: document.getElementById("profileHeadlineInput").value,
    experience: collectEntries("experienceEntries", ["company", "position", "startYear", "endYear"]),
    education: collectEntries("educationEntries", ["institution", "degree", "eduStartYear", "eduEndYear"]),
    skills: Array.from(document.getElementById("skillsContainer").children).map((item) => item.textContent),
    languages: Array.from(document.getElementById("languagesContainer").children).map((item) => item.textContent),
  };
}

function collectEntries(containerId, fields) {
  const entries = [];
  document.getElementById(containerId).querySelectorAll(".entry-card").forEach((card) => {
    const entry = {};
    fields.forEach((field) => {
      entry[field] = card.querySelector(`input[name="${field}"]`).value;
    });
    entries.push(entry);
  });
  return entries;
}

function updateProfile(data) {
  updateSection(
    "experienceSectionDisplay",
    data.experience,
    (exp) => `<div class="profile-desc-row"><strong>${exp.company}</strong> (${exp.startYear} - ${exp.endYear}): ${exp.position}</div>`
  );

  updateSection(
    "educationSectionDisplay",
    data.education,
    (edu) => `<div class="profile-desc-row"><strong>${edu.institution}</strong> (${edu.eduStartYear} - ${edu.eduEndYear}): ${edu.degree}</div>`
  );

  updateContainer("skillsSectionDisplay", data.skills, "skill-item");
  updateContainer("languagesSectionDisplay", data.languages, "language-item");
}

function updateSection(sectionId, data, formatter) {
  const section = document.getElementById(sectionId);
  section.innerHTML = data.map(formatter).join("");
}

function updateContainer(containerId, items, className) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map((item) => `<span class="${className}">${item}</span>`).join("");
}

function loadProfileData() {
  const profileImage = localStorage.getItem("profileImage");
  const coverPhoto = localStorage.getItem("coverPhoto");
  const name = localStorage.getItem("profileName");
  const headline = localStorage.getItem("profileHeadline");
  const aboutText = localStorage.getItem("aboutText");
  const savedInterests = localStorage.getItem("interests");

  if (profileImage) updateProfileImage(profileImage);
  if (coverPhoto) updateCoverPhoto(coverPhoto);
  if (name) {
    document.querySelector(".profile-name").textContent = name;
    document.getElementById("profileNameInput").value = name;
  }
  if (headline) {
    document.querySelector(".profile-headline").textContent = headline;
    document.getElementById("profileHeadlineInput").value = headline;
  }
  if (aboutText) {
    document.getElementById("aboutText").textContent = aboutText;
  }
  if (savedInterests) {
    interests = JSON.parse(savedInterests);
    updateInterestTags();
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function updateProfileInfo() {
  const nameInput = document.getElementById("profileNameInput");
  const headlineInput = document.getElementById("profileHeadlineInput");
  const profileName = document.querySelector(".profile-name");
  const profileHeadline = document.querySelector(".profile-headline");

  if (nameInput && profileName) {
    profileName.textContent = nameInput.value;
  }
  if (headlineInput && profileHeadline) {
    profileHeadline.textContent = headlineInput.value;
  }
}

function saveProfileData(profileData) {
  const profilesRef = database.ref("profiles/");
  const newProfileRef = profilesRef.push();
  newProfileRef.set(profileData);
}


function toggleMenu() {
  var menu = document.getElementById("menuPerfil")
  menu.style.display = menu.style.display === "block" ? "none" : "block"
}

document.addEventListener("click", (event) => {
  var perfil = document.querySelector(".perfil")
  if (!perfil.contains(event.target)) {
    document.getElementById("menuPerfil").style.display = "none"
  }
})
function showNotificationPopup(message) {
  var popup = document.getElementById("notificationPopup")
  document.getElementById("notificationMessage").textContent = message
  popup.style.display = "block"
  setTimeout(closeNotificationPopup, 5000) // Se cierra automáticamente después de 5 segundos
}

function closeNotificationPopup() {
  document.getElementById("notificationPopup").style.display = "none"
}
document.addEventListener("DOMContentLoaded", () => {
  // Datos de ejemplo para las notificaciones
  const notifications = [
    {
      id: 1,
      avatar: "/user1.jpg",
      name: "Melvin Desobediente",
      action: "comentó la publicación de",
      target: "Oración Diaria",
      time: "1 día",
      read: false,
    },
    {
      id: 2,
      avatar: "/user2.jpg",
      name: "Yohandri Jesus",
      action: "te envió una sugerencia de amistad",
      target: "",
      time: "7 horas",
      read: false,
    },
    {
      id: 3,
      avatar: "/user3.jpg",
      name: "Milagros Canela Gálvez",
      action: "comentó la publicación de",
      target: "Arrieche Roger",
      time: "1 día",
      read: false,
    },
  ]

  // Toggle del panel de notificaciones
  const notificationsToggle = document.getElementById("notifications-toggle")
  const notificationsLink = notificationsToggle.querySelector("a")

  notificationsLink.addEventListener("click", (e) => {
    e.preventDefault()
    notificationsToggle.classList.toggle("show")
    loadNotifications() // Cargar notificaciones cuando se abre el panel
  })

  // Cerrar el panel cuando se hace clic fuera de él
  document.addEventListener("click", (e) => {
    if (!notificationsToggle.contains(e.target)) {
      notificationsToggle.classList.remove("show")
    }
  })

  // Función para crear un elemento de notificación
  function createNotificationElement(notification) {
    const div = document.createElement("div")
    div.className = "notification-item"

    div.innerHTML = `
          <img src="${notification.avatar}" alt="" class="notification-avatar">
          <div class="notification-details">
              <p class="notification-text">
                  <strong>${notification.name}</strong> 
                  ${notification.action} 
                  ${notification.target ? `<strong>${notification.target}</strong>` : ""}
              </p>
              <div class="notification-meta">
                  <span>${notification.time}</span>
                  ${!notification.read ? '<div class="unread-dot"></div>' : ""}
              </div>
          </div>
      `

    return div
  }

  // Función para cargar las notificaciones
  function loadNotifications() {
    const allNotificationsList = document.querySelector("#todas .notifications-list")
    const unreadNotificationsList = document.querySelector("#no-leidas .notifications-list")

    // Limpiar las listas
    allNotificationsList.innerHTML = ""
    unreadNotificationsList.innerHTML = ""

    // Cargar todas las notificaciones
    notifications.forEach((notification) => {
      allNotificationsList.appendChild(createNotificationElement(notification))

      // Si la notificación no está leída, también la añadimos a la pestaña de no leídas
      if (!notification.read) {
        unreadNotificationsList.appendChild(createNotificationElement(notification))
      }
    })
  }

  // Manejar los cambios de pestaña
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      // Remover la clase active de todos los botones
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active")
      })

      // Añadir la clase active al botón clickeado
      button.classList.add("active")

      // Ocultar todos los contenidos
      document.querySelectorAll(".notifications-content").forEach((content) => {
        content.style.display = "none"
      })

      // Mostrar el contenido correspondiente
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).style.display = "block"
    })
  })

  // Cargar las notificaciones inicialmente
  loadNotifications()
})
// Inicializa el perfil
initializeProfile()
document.addEventListener("DOMContentLoaded", () => {
  const composeBtn = document.getElementById("compose-btn");
  const composeModal = document.getElementById("compose-modal");
  const composeOverlay = document.getElementById("compose-overlay");
  const chatModal = document.getElementById("chat-modal");
  const chatOverlay = document.getElementById("chat-overlay");
  const searchInput = document.getElementById("search-input");
  const friendsList = document.getElementById("friends-list");
  const chatAvatar = document.getElementById("chat-avatar");
  const chatFriendName = document.getElementById("chat-friend-name");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const chatInput = document.getElementById("chatInput");
  const messagesContainer = document.getElementById("messagesContainer");
  const sendButton = document.getElementById("sendButton");

  const friends = [
    { id: "1", name: "Jennifer Ocasio", image: "https://via.placeholder.com/40" },
    { id: "2", name: "Laribel Jerez", image: "https://via.placeholder.com/40" }
  ];

  let selectedFriend = null;
  const messages = [];

  function openModal(modal) {
    modal.classList.remove("hidden");
  }
  function closeModal(modal) {
    modal.classList.add("hidden");
  }

  composeBtn.addEventListener("click", () => {
    openModal(composeModal);
    searchInput.value = "";
    renderFriends(friends);
  });

  composeOverlay.addEventListener("click", () => closeModal(composeModal));
  chatOverlay.addEventListener("click", () => closeModal(chatModal));
  closeChatBtn.addEventListener("click", () => closeModal(chatModal));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = friends.filter(friend => friend.name.toLowerCase().includes(query));
    renderFriends(filtered);
  });

  function renderFriends(friendsArray) {
    friendsList.innerHTML = "";
    friendsArray.forEach(friend => {
      const btn = document.createElement("button");
      btn.className = "friend-button";
      btn.innerHTML = `<img class="friend-avatar" src="${friend.image}" alt="${friend.name}"><span>${friend.name}</span>`;
      btn.addEventListener("click", () => {
        selectedFriend = friend;
        closeModal(composeModal);
        openChatModal(friend);
      });
      friendsList.appendChild(btn);
    });
  }

  function openChatModal(friend) {
    chatAvatar.src = friend.image;
    chatAvatar.alt = friend.name;
    chatFriendName.textContent = friend.name;
    openModal(chatModal);
  }

  function renderMessages() {
    messagesContainer.innerHTML = "";
    messages.forEach(message => {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message-container";
      const bubble = document.createElement("div");
      bubble.className = "message-bubble";
      bubble.textContent = message.text;
      msgDiv.appendChild(bubble);
      messagesContainer.appendChild(msgDiv);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (text !== "") {
      messages.push({ text });
      chatInput.value = "";
      renderMessages();
    }
  }

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  sendButton.addEventListener("click", handleSend);

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});
const composeBtn = document.getElementById("compose-btn")

function openChat(friendId) {
  document.getElementById("chat-modal").classList.remove("hidden")
  composeBtn.classList.add("hidden")
}

function closeChat() {
  document.getElementById("chat-modal").classList.add("hidden")
  composeBtn.classList.remove("hidden")
}

// Update event listeners
document.getElementById("close-chat-btn").addEventListener("click", closeChat)
document.getElementById("chat-overlay").addEventListener("click", closeChat)

