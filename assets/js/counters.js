document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number[data-target]");

  const animate = (el) => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0");
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value    = ease * target;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((el) => observer.observe(el));
});
