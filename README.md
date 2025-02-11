1.Proyecto con Firebase y Node.js
Este proyecto utiliza Firebase para almacenar datos en tiempo real a través de Firestore o Realtime Database.
-Requisitos
2.Asegúrate de tener instalado Node.js. Si no lo tienes, puedes descargarlo e instalarlo desde https://nodejs.org/es
-Instalación de dependencias
3.Crea un nuevo proyecto de Node.js o navega al directorio de tu proyecto existente.
-Inicializa un proyecto Node.js con:
npm init -y
-Instala Firebase como una dependencia:
npm install firebase
2.Configuración de Firebase
-Si aún no tienes una cuenta de Firebase, crea un proyecto en https://console.firebase.google.com/ .
-Configura tu base de datos en Firebase (Realtime Database o Firestore).
-Obtén la configuración de tu proyecto Firebase desde el panel de Firebase y 
reemplaza los valores en el siguiente código de configuración:

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFCss8GvV6UNMAE55ZWSI1bRembSopKGA",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

Este código se encuentra en la configuración de tu proyecto Firebase.
