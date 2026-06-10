const revealGroups = [
  {
    selector: ".services-header, .about-container > div, .stats-header, .testimonials-header, .faq-header, .contact-container > div, .clients-label",
    lift: false,
  },
  {
    selector: ".service-card, .stat-card, .testimonial-card, .faq-item, .contact-item, .client-logo",
    lift: true,
  },
];

const revealElements = [];

revealGroups.forEach((group) => {
  document.querySelectorAll(group.selector).forEach((element) => {
    element.classList.add("reveal");
    if (group.lift) element.classList.add("reveal-lift");
    revealElements.push(element);
  });
});

// Stagger based on sibling index within the same parent, not global index
revealElements.forEach((element) => {
  const siblings = Array.from(element.parentElement.children).filter(
    (child) => child.classList.contains("reveal")
  );
  const index = siblings.indexOf(element);
  element.style.setProperty("--reveal-delay", `${Math.min(index * 60, 200)}ms`);
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
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}
