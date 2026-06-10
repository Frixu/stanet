const revealGroups = [
  {
    selector: ".services-header, .about-container > div, .stats-header, .testimonials-header, .faq-header, .contact-container > div, .legal-hero .legal-container, .legal-card",
    lift: false,
  },
  {
    selector: ".service-card, .stat-card, .testimonial-card, .faq-item, .contact-item",
    lift: true,
  },
];

const revealElements = [];

revealGroups.forEach((group) => {
  document.querySelectorAll(group.selector).forEach((element, index) => {
    element.classList.add("reveal");

    if (group.lift) {
      element.classList.add("reveal-lift");
    }

    element.style.setProperty("--reveal-delay", `${Math.min(index * 80, 320)}ms`);
    revealElements.push(element);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}
