const navbar = document.getElementById("navbar");
const navMenu = document.getElementById("nav-menu");
const hamburger = document.querySelector(".hamburger");

const closeMobileMenu = () => {
  navMenu.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Otwórz menu");
  hamburger.textContent = "☰";
};

window.addEventListener("scroll", () => {

  if(window.scrollY > 50){
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});

hamburger.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");

  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
  hamburger.textContent = isOpen ? "×" : "☰";
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", (event) => {
  if (!navbar.contains(event.target)) {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    closeMobileMenu();
  }
});
