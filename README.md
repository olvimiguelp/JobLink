# **Proyecto con Firebase y Node.js**

Este proyecto utiliza Firebase para almacenar datos en tiempo real a través de Firestore o Realtime Database.

## **Requisitos**

1. Asegúrate de tener instalado Node.js. Si no lo tienes, puedes descargarlo e instalarlo desde [Node.js](https://nodejs.org/es).

## **Instalación de dependencias**

1. Crea un nuevo proyecto de Node.js o navega al directorio de tu proyecto existente.
2. Inicializa un proyecto Node.js con:
   ```bash
   npm init -y
   ```
3. Instala Firebase como una dependencia:
   ```bash
   npm install firebase
   ```

## **Configuración de Firebase**

1. Si aún no tienes una cuenta de Firebase, crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Configura tu base de datos en Firebase (Realtime Database o Firestore).
3. Obtén la configuración de tu proyecto Firebase desde el panel de Firebase y reemplaza los valores en el siguiente código de configuración:

   ```javascript
   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   const firebaseConfig = {
     apiKey: "",
     authDomain: "",
     databaseURL: "",
     projectId: "",
     storageBucket: "",
     messagingSenderId: "",
     appId: "",
     measurementId: ""
   };
   ```

Este código se encuentra en la configuración de tu proyecto Firebase.
