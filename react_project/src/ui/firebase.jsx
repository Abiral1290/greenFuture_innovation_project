// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken } from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: "AIzaSyCd4Q_F0PN0vT52toxb727FW5UhTwmBlmE",
//   authDomain: "reactproject-d91cc.firebaseapp.com",
//   projectId: "reactproject-d91cc",
//   storageBucket: "reactproject-d91cc.firebasestorage.app",
//   messagingSenderId: "947085923194",
//   appId: "1:947085923194:web:57e5b17920a5e02ae0bcc3",
//   measurementId: "G-7S3C4VJRM0"
// };



// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // Request notification permission
// export const requestNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//     } else {
//       console.log('Notification permission denied.');
//     }
//   } catch (error) {
//     console.error('Error requesting notification permission:', error);
//   }
// };

// // Get Firebase token
// export const getFirebaseToken = async () => {
//   try {
//     const token = await getToken(messaging, {
//       vapidKey: 'BHs8EeIrOvv72miheon9xsERH2LiIeJHU1nf53xRmjp1WQcYX-SodT_UNC321hJrh4AKbXEUhiyuenq3qAs2FQY',  // Replace with actual VAPID key
//     });
//     if (token) {
//       console.log('Firebase token:', token);
//       return token;
//     } else {
//       console.log('No token available. Request permission to generate one.');
//     }
//   } catch (error) {
//     console.error('Error getting Firebase token:', error);
//   }
// };

// // Register Service Worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then(function(registration) {
//       console.log('Service Worker registered:', registration);
//     })
//     .catch(function(error) {
//       console.error('Service Worker registration failed:', error);
//     });
// }

