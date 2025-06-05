
export function enableDarkModeToggle() {

const themeToggles = [
    document.getElementById('darkModeToggle'),
    document.getElementById('mobileDarkModeToggle')
  ];
  const htmlEl = document.documentElement;

  function setTheme(mode) {
    htmlEl.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    themeToggles.forEach(btn => {
      if (btn) btn.textContent = mode === 'dark' ? '☀️' : '🌙';
    });
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  themeToggles.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    }
  });
}
