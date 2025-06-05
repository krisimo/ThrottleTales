export function setupLogin() {
  // Grab UI elements
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

  // Toggle login/register form visibility
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

  // Open and close modal logic
  function openModal() {
    modal?.classList.remove('hidden');
    overlay?.classList.remove('hidden');
  }

  function closeModal() {
    modal?.classList.add('hidden');
    overlay?.classList.add('hidden');
  }

  openBtn?.addEventListener('click', openModal);
  mobileAuthBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // Handle registration
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if (!username || !email || !password) return showMessage('Please fill out all fields.');
    if (!validateEmail(email)) return showMessage('Invalid email format.');
    if (password.length < 6) return showMessage('Password must be at least 6 characters.');

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Registration successful! You can now log in.");
        showLoginBtn?.click();
      } else {
        showMessage(data.errors?.[0]?.message || "Something went wrong.");
      }
    } catch {
      showMessage("Network error.");
    }
  });

  // Handle login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.data?.accessToken) {
        const user = data.data;
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("currentUser", user.name);
        localStorage.setItem("currentUsername", user.name);
        showMessage(`Welcome ${user.name}!`);
        updateUIAfterLogin(user.name);
        closeModal();
      } else {
        showMessage(data.errors?.[0]?.message || "Login failed.");
      }
    } catch {
      showMessage("Network error.");
    }
  });

  // Logout
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('token');
    updateUIAfterLogout();
    showMessage('You have been logged out.');
  });

  // Keep user logged in on page refresh
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    updateUIAfterLogin(currentUser);
  }

  // Update UI on login
  function updateUIAfterLogin(username) {
    openBtn?.classList.add('hidden');
    userWelcome.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${username}</a>`;
    userWelcome.classList.remove('hidden');
    logoutBtn?.classList.remove('hidden');

    mobileAuthBtn?.classList.add('hidden');
    if (userWelcomeMobile) {
      userWelcomeMobile.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${username}</a>`;
      userWelcomeMobile.classList.remove('hidden');
    }
    logoutBtnMobile?.classList.remove('hidden');
  }

  // Update UI on logout
  function updateUIAfterLogout() {
    openBtn?.classList.remove('hidden');
    userWelcome.classList.add('hidden');
    logoutBtn?.classList.add('hidden');

    mobileAuthBtn?.classList.remove('hidden');
    if (userWelcomeMobile) userWelcomeMobile.classList.add('hidden');
    logoutBtnMobile?.classList.add('hidden');
  }

  // Show feedback messages
  function showMessage(msg) {
    if (messageBox) messageBox.textContent = msg;
  }

  // Simple email validator
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
