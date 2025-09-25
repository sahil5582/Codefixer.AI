// ==== Firebase Initialization ====
const firebaseConfig = {
  apiKey: "AIzaSyBI5jDcA_QNrujfn0cI5-IHUtZlGm8Q6X0",
  authDomain: "codefixer-ai.firebaseapp.com",
  projectId: "codefixer-ai",
  storageBucket: "codefixer-ai.firebasestorage.app",
  messagingSenderId: "591922324510",
  appId: "1:591922324510:web:77dd4480a11b9e2fddfa0f",
  measurementId: "G-ZMNCWK2XHD"

  // ... other config values
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("Script loaded - Firebase initialized");

// ===== Login Handler =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    console.log("Login attempt:", email);
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert("Login successful!");
        window.location.href = "home.html";
      })
      .catch(error => {
        alert(error.message);
      });
  });
}

// ===== Signup Modal Logic =====
const openSignupBtn = document.getElementById('open-signup-btn');
const signupModal = document.getElementById('signup-modal');
const signupCancel = document.getElementById('signup-cancel');

if (openSignupBtn && signupModal) {
  openSignupBtn.addEventListener('click', function() {
    signupModal.style.display = 'flex';
  });
}
if (signupCancel && signupModal) {
  signupCancel.addEventListener('click', function() {
    signupModal.style.display = 'none';
  });
}

// ===== Signup Handler =====
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    console.log("Signup attempt:", email);
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        // Save username to Firestore (with user's UID as document ID)
        return db.collection("users").doc(user.uid).set({
          username: username,
          email: email,
          signupAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          alert("Signup successful!");
          signupModal.style.display = 'none';
          window.location.href = "home.html";
        });
      })
      .catch(error => {
        alert(error.message);
      });
  });
}

const quizData = {
  python: [
    {
      question: "What is the output of print(2**3)?",
      options: ["5", "6", "8", "9"],
      answer: 2 // Index of correct option
    },
    // ...more questions
  ],
  js: [
    // ...JS logic questions
  ],
  debugger: [
    // ...Error Debugger problems (could show buggy code for user to fix)
  ]
};

document.querySelectorAll('.start-quiz-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const quizType = btn.dataset.quiz;
    startQuiz(quizType);
  });
});

function startQuiz(type) {
  const questions = quizData[type];
  // Render first question, handle answer checking, progress, and scoring
}

document.querySelectorAll('.start-quiz-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const quizType = btn.getAttribute('data-quiz');
    startQuiz(quizType);
  });
});

function startQuiz(type) {
  alert("Starting the " + type + " quiz!");
  // Add modal or page navigation here
}


