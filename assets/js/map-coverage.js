document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("coverage-leaflet");
  if (!el || typeof L === "undefined") return;

  // Punkty zasięgu — ładowane z coverage-points.js (wygenerowane z adresów podłączeń)
  const LOCATIONS = (window.STANET_POINTS && window.STANET_POINTS.length)
    ? window.STANET_POINTS
    : [];

  const map = L.map(el, {
    center: [52.05, 19.3],
    zoom: 6,
    minZoom: 5,
    maxZoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,          // nie blokuje przewijania strony
    maxBounds: [[48.5, 13.0], [55.5, 25.5]],
    maxBoundsViscosity: 0.9,
    attributionControl: true
  });

  // usuń domyślną flagę Ukrainy z podpisu Leaflet
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');

  // ciemne kafelki Esri (darmowe, bez klucza API)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 16
  }).addTo(map);

  LOCATIONS.forEach(([lat, lng]) => {
    L.circleMarker([lat, lng], {
      radius: 3.5,
      color: "#93C5FD",
      weight: 0.5,
      fillColor: "#60A5FA",
      fillOpacity: 0.85,
      className: "map-glow"
    }).addTo(map);
  });

  // przelicz rozmiar mapy, gdy sekcja wejdzie w widok
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        map.invalidateSize();
        io.disconnect();
      }
    });
  }, { threshold: 0.1 });
  io.observe(el);
});
