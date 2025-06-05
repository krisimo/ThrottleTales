  export function setupNavbar() {
  
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  burgerBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  document.querySelectorAll('.nav-mobile a, .nav-mobile button').forEach(el => {
    el.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
  
}
