// auth.js
export function setupAuthModal() {
  // === Get modal and navigation elements ===
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authOverlay');
  const openBtn = document.getElementById('openAuth');
  const mobileAuthBtn = document.getElementById('mobileAuth');
  const closeBtn = document.getElementById('closeModal');
  const userWelcome = document.getElementById('userWelcome');
  const logoutBtn = document.getElementById('logoutBtn');
  const userWelcomeMobile = document.getElementById('userWelcomeMobile');
  const logoutBtnMobile = document.getElementById('logoutBtnMobile');
  const messageBox = document.getElementById('message');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showLoginBtn = document.getElementById('showLogin');
  const showRegisterBtn = document.getElementById('showRegister');

  // === Modal open/close functions ===
  function openModal() {
    modal?.classList.remove('hidden');
    overlay?.classList.remove('hidden');
  }

  function closeModal() {
    modal?.classList.add('hidden');
    overlay?.classList.add('hidden');
  }

  // === Show message in message box (e.g. error, status)
  function showMessage(msg) {
    if (messageBox) messageBox.textContent = msg;
  }

  // === Simple email validator ===
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // === Update UI after successful login ===
  function updateUIAfterLogin(username) {
    openBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
    userWelcome.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${username}</a>`;
    userWelcome.classList.remove('hidden');

    mobileAuthBtn?.classList.add('hidden');
    if (userWelcomeMobile) {
      userWelcomeMobile.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${username}</a>`;
      userWelcomeMobile.classList.remove('hidden');
    }
    logoutBtnMobile?.classList.remove('hidden');
  }

  // === Reset UI on logout ===
  function updateUIAfterLogout() {
    openBtn?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');
    userWelcome.classList.add('hidden');
    userWelcome.innerHTML = "";

    mobileAuthBtn?.classList.remove('hidden');
    if (userWelcomeMobile) {
      userWelcomeMobile.classList.add('hidden');
      userWelcomeMobile.innerHTML = "";
    }
    logoutBtnMobile?.classList.add('hidden');
  }

  // === Auth modal logic ===
  showLoginBtn?.addEventListener('click', () => {
    loginForm?.classList.add('active');
    registerForm?.classList.remove('active');
    showMessage('');
  });

  showRegisterBtn?.addEventListener('click', () => {
    registerForm?.classList.add('active');
    loginForm?.classList.remove('active');
    showMessage('');
  });

  openBtn?.addEventListener('click', openModal);
  mobileAuthBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // === Show welcome UI on page load if already logged in ===
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    updateUIAfterLogin(currentUser);
  }

  // === Logout buttons (desktop + mobile) ===
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    updateUIAfterLogout();
    showMessage('You have been logged out.');
  });

  logoutBtnMobile?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    updateUIAfterLogout();
    showMessage('You have been logged out.');
  });

  // === Global access for login.js to reuse these functions ===
  window.updateUIAfterLogin = updateUIAfterLogin;
  window.updateUIAfterLogout = updateUIAfterLogout;
}
