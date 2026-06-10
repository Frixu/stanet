document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const modal  = document.getElementById("cookie-modal");
  if (!banner) return;

  const prefs = (() => {
    try { return JSON.parse(localStorage.getItem("cookie_prefs") || "null"); } catch { return null; }
  })();

  if (prefs) return; // zgoda już udzielona

  setTimeout(() => banner.classList.add("visible"), 300);

  function closeBanner() {
    banner.classList.remove("visible");
    setTimeout(() => banner.remove(), 400);
  }

  function saveAndClose(analytics, marketing) {
    localStorage.setItem("cookie_prefs", JSON.stringify({
      necessary: true,
      analytics,
      marketing,
      date: new Date().toISOString()
    }));
    closeBanner();
  }

  // Akceptuję wszystkie
  document.getElementById("cookie-accept").addEventListener("click", () => {
    saveAndClose(true, true);
  });

  // Odrzuć opcjonalne
  document.getElementById("cookie-reject").addEventListener("click", () => {
    saveAndClose(false, false);
  });

  // Otwórz modal
  document.getElementById("cookie-customize").addEventListener("click", () => {
    modal.classList.add("open");
  });

  // Zamknij modal klikając tło
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  // Akceptuję wszystkie z modala
  document.getElementById("cookie-accept-all").addEventListener("click", () => {
    saveAndClose(true, true);
    modal.classList.remove("open");
  });

  // Zapisz ustawienia z modala
  document.getElementById("cookie-save-prefs").addEventListener("click", () => {
    const analytics = document.getElementById("cookie-analytics").checked;
    const marketing = document.getElementById("cookie-marketing").checked;
    saveAndClose(analytics, marketing);
    modal.classList.remove("open");
  });
});
