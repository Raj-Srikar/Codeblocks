// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
// import { firestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJfWl6QS1SPFEkfWtor9bX-0_kin6dTlQ",
    authDomain: "codeblocks-a60dd.firebaseapp.com",
    projectId: "codeblocks-a60dd",
    appId: "1:572651011111:web:e2b2446279383c49776202",
    measurementId: "G-F7WFQH6G2V"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Make auth and firestore references
const cb_auth = firebase.auth();
const db = firebase.firestore();

// Update firestore settings
db.settings({ timestampsInSnapshots: true });


function sanitizeContent(content) {
    let syms = {
        '"' : '&#34',
        "'" : '&#39',
        '(' : '&#40',
        ')' : '&#41',
        '/' : '&#47',
        '<' : '&#60',
        '>' : '&#62'
    }

    for (const key in syms) {
        if (Object.hasOwnProperty.call(syms, key)) {
            if(content.includes(key))
                content = content.replace(key, syms[key])
        }
    }
    return content;
}