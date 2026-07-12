document.addEventListener("DOMContentLoaded", () => {

  // Resaltar opción activa del menú
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === current) {
      link.classList.add("active");
    }
  });

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      const target = document.querySelector(this.getAttribute("href"));

      if (target) {

        e.preventDefault();

        target.scrollIntoView({

          behavior: "smooth",
          block: "start"

        });

      }

    });

  });

});

// ===========================================
// Sistema de mensajes reutilizable
// ===========================================

function mostrarMensaje(texto, tipo = "info") {

  let caja = document.getElementById("mensaje-global");

  if (!caja) {

    caja = document.createElement("div");

    caja.id = "mensaje-global";

    caja.style.position = "fixed";
    caja.style.right = "20px";
    caja.style.bottom = "20px";
    caja.style.padding = "14px 18px";
    caja.style.borderRadius = "8px";
    caja.style.color = "#ffffff";
    caja.style.fontWeight = "bold";
    caja.style.boxShadow = "0 6px 18px rgba(0,0,0,.25)";
    caja.style.zIndex = "9999";

    document.body.appendChild(caja);

  }

  switch (tipo) {

    case "ok":
      caja.style.background = "#16a34a";
      break;

    case "error":
      caja.style.background = "#dc2626";
      break;

    case "warning":
      caja.style.background = "#f59e0b";
      break;

    default:
      caja.style.background = "#2563eb";

  }

  caja.textContent = texto;

  caja.style.display = "block";

  setTimeout(() => {

    caja.style.display = "none";

  }, 3500);

}

// ===========================================
// Configuración general de la plataforma
// ===========================================

const NegrettePlatform = {

  version: "0.2.0",

  portal: {

    endpoint: "/.netlify/functions/consulta-expediente"

  },

  estudio: {

    nombre: "Estudio Negrette",

    whatsapp: "+54 381 6301433",

    email: "estudionegretteab@outlook.com"

  }

};

// ===========================================
// Inicialización
// ===========================================

console.log(
  `${NegrettePlatform.estudio.nombre} - Versión ${NegrettePlatform.version}`
);
// ===========================================
// Menú Responsive
// ===========================================

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const homeNav = document.getElementById("homeNav");

    if (menuToggle && homeNav) {

        // Abrir / cerrar menú
        menuToggle.addEventListener("click", () => {

            homeNav.classList.toggle("active");

            menuToggle.textContent =
                homeNav.classList.contains("active") ? "✕" : "☰";

        });

        // Cerrar menú al pulsar una opción
        homeNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                homeNav.classList.remove("active");
                menuToggle.textContent = "☰";

            });

        });

        // Si vuelve a escritorio, dejar el menú limpio
        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {

                homeNav.classList.remove("active");
                menuToggle.textContent = "☰";

            }

        });

    }

});