// Custom smooth scroll
function smoothScrollTo(targetEl) {
  const navbarHeight = 96;
  const startY = window.scrollY;
  const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
  const distance = Math.abs(targetY - startY);
  const duration = Math.min(Math.max(distance * 0.4, 400), 1100);
  const startTime = performance.now();

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(target);
  });
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});
