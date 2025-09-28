// ==== Firebase Initialization ====
const firebaseConfig = {
  apiKey: "AIzaSyBI5jDcA_QNrujfn0cI5-IHUtZlGm8Q6X0",
  authDomain: "codefixer-ai.firebaseapp.com",
  projectId: "codefixer-ai",
  storageBucket: "codefixer-ai.firebasestorage.app",
  messagingSenderId: "591922324510",
  appId: "1:591922324510:web:77dd4480a11b9e2fddfa0f",
  measurementId: "G-ZMNCWK2XHD"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase initialized");

// ===== Authentication Setup =====
document.addEventListener('DOMContentLoaded', () => {

  // Login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          alert("Login successful!");
          window.location.href = "home.html";
        })
        .catch(error => alert(error.message));
    });
  }

  // Signup modal handling
  const openSignupBtn = document.getElementById('open-signup-btn');
  const signupModal = document.getElementById('signup-modal');
  const signupCancel = document.getElementById('signup-cancel');
  const signupForm = document.getElementById('signup-form');

  if (openSignupBtn && signupModal) {
    openSignupBtn.addEventListener('click', () => signupModal.style.display = 'flex');
  }

  if (signupCancel && signupModal) {
    signupCancel.addEventListener('click', () => signupModal.style.display = 'none');
  }

  // Signup form handler
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          return db.collection('users').doc(user.uid).set({
            username,
            email,
            signupAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          alert("User and password saved successfully!");
          signupModal.style.display = 'none';
          window.location.href = "login.html";
        })
        .catch(error => alert(error.message));
    });
  }

  // Load all data sections if container is present
  if (document.querySelector('.quizzes-list')) {
    loadAndRenderQuizzes();
  }
  if (document.querySelector('.learning-section')) {
    loadLearningModules();
  }
  if (document.querySelector('#challenge-list')) {
    fetchChallenges();
  }
});

// ===== Load and Render Quizzes =====
async function loadAndRenderQuizzes() {
  const container = document.querySelector('.quizzes-list');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('quizzes').get();
    snapshot.forEach(doc => {
      const quiz = doc.data();
      const card = document.createElement('div');
      card.className = 'quiz-card';

      const title = document.createElement('h3');
      title.textContent = quiz.title;

      const desc = document.createElement('p');
      desc.textContent = quiz.description || '';

      const btn = document.createElement('button');
      btn.className = 'primary-btn';
      btn.textContent = 'Start Quiz';
      btn.addEventListener('click', () => {
        window.location.href = `quiz.html?quizId=${doc.id}`;
      });

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(btn);

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading quizzes:', error);
  }
}

// ===== Load Learning Modules =====
async function loadLearningModules() {
  const container = document.querySelector('.learning-section');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('tutorials').get();
    snapshot.forEach(doc => {
      const tutorial = doc.data();
      const card = document.createElement('div');
      card.className = 'learning-card';

      const title = document.createElement('h3');
      title.textContent = tutorial.title;

      const desc = document.createElement('p');
      desc.textContent = tutorial.description;

      const btnContainer = document.createElement('div');
      btnContainer.className = 'btn-container';

      if (tutorial.url) {
        const videoBtn = document.createElement('button');
        videoBtn.className = 'primary-btn';
        videoBtn.textContent = 'Watch Video';
        videoBtn.addEventListener('click', () => {
          window.open(tutorial.url, '_blank');
        });
        btnContainer.appendChild(videoBtn);
      }

      const notesBtn = document.createElement('button');
      notesBtn.className = 'primary-btn';
      notesBtn.textContent = 'Notes';
      notesBtn.addEventListener('click', () => {
        if (tutorial.detail && tutorial.detail.startsWith('http')) {
          window.open(tutorial.detail, '_blank');
        } else {
          alert(tutorial.detail || "No notes available.");
        }
      });
      btnContainer.appendChild(notesBtn);

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(btnContainer);

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading tutorials:', error);
  }
}

// ===== Load Challenges =====
async function fetchChallenges() {
  const challengeListEl = document.getElementById('challenge-list');
  const errorMessageEl = document.getElementById('error-message');

  errorMessageEl.textContent = '';
  challengeListEl.innerHTML = '<p>Loading challenges...</p>';

  try {
    const snapshot = await db.collection('challenges').get();

    if (snapshot.empty) {
      challengeListEl.innerHTML = '<p>No challenges available right now.</p>';
      return;
    }

    challengeListEl.innerHTML = '';
    snapshot.forEach(doc => {
      const challenge = doc.data();
      const card = document.createElement('div');
      card.className = 'progress-card';

      card.innerHTML = `
        <h3 style="color:#6e4fd0; margin-top: 0;">${challenge.title}</h3>
        <p>${challenge.description || ''}</p>
        <p>
          <strong>Difficulty:</strong> ${challenge.difficulty || 'N/A'} <br />
          <strong>Attempts:</strong> ${challenge.attempts_count || 0}
        </p>
        <button class="primary-btn">Start Challenge</button>
      `;

      card.querySelector('button').onclick = () => {
        window.location.href = `/quiz.html?id=${doc.id}`;
      };

      challengeListEl.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading challenges:', error);
    errorMessageEl.textContent =
      'Failed to load challenges. Please try again later.';
    challengeListEl.innerHTML = '';
  }
}
