// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG_UV0FeSkAU8pzwghL3tmlMK-ceQqo2Y",
  authDomain: "joblinkbase.firebaseapp.com",
  databaseURL: "https://joblinkbase-default-rtdb.firebaseio.com",
  projectId: "joblinkbase",
  storageBucket: "joblinkbase.firebasestorage.app",
  messagingSenderId: "982693022472",
  appId: "1:982693022472:web:f8b431fd1ac7242c0f3abd",
  measurementId: "G-VEGLV69L9D"
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

// Initialize the profile
initializeProfile();