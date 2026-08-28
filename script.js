/* MZ GARAGE x NO NAME GARAGE — JavaScript V2 */
(() => {
  "use strict";

  const WHATSAPP = "595991358422";
  const AUDIO_FILE = "Cancion1.mp3";

  const waUrl = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  document.addEventListener("DOMContentLoaded", () => {
    /* Menú móvil */
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("active");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        toggle.innerHTML = `<i class="fas ${open ? "fa-xmark" : "fa-bars"}"></i>`;
      });
      nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }));
    }

    /* WhatsApp de servicios */
    document.querySelectorAll(".btn-service-wa").forEach(btn => {
      const service = btn.dataset.service || "un servicio";
      btn.href = waUrl(`Hola, me interesa consultar sobre ${service}.`);
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    });

    /* Formulario de reserva/cotización */
    const form = document.getElementById("whatsappForm");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const get = id => document.getElementById(id)?.value.trim() || "";
        const text = [
          "Hola 👋 Quiero solicitar un turno / cotización.",
          "",
          `Nombre: ${get("nombre")}`,
          `WhatsApp: ${get("telefono") || "No indicado"}`,
          `Vehículo: ${get("vehiculo")}`,
          `Servicio: ${get("tipoServicio")}`,
          `Fecha preferida: ${get("fecha") || "A coordinar"}`,
          `Hora preferida: ${get("hora") || "A coordinar"}`,
          `Detalles: ${get("mensaje")}`
        ].join("\n");
        window.open(waUrl(text), "_blank", "noopener,noreferrer");
      });
    }

    /* Carrusel responsive: calcula el ancho real */
    const track = document.getElementById("projectsTrack");
    const moveCarousel = direction => {
      if (!track) return;
      const card = track.querySelector(".project-card");
      const amount = card ? card.getBoundingClientRect().width + 22 : track.clientWidth * .85;
      track.scrollBy({ left: direction * amount, behavior: "smooth" });
    };
    document.getElementById("prevProject")?.addEventListener("click", () => moveCarousel(-1));
    document.getElementById("nextProject")?.addEventListener("click", () => moveCarousel(1));

    /* Autoplay del carrusel solo cuando el usuario no lo está usando */
    let timer;
    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!track || document.hidden) return;
        const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
        if (end) track.scrollTo({left: 0, behavior: "smooth"});
        else moveCarousel(1);
      }, 5000);
    };
    track?.addEventListener("mouseenter", () => clearInterval(timer));
    track?.addEventListener("mouseleave", start);
    track?.addEventListener("touchstart", () => clearInterval(timer), {passive:true});
    track?.addEventListener("touchend", start, {passive:true});
    start();

    /* Galería: crea miniaturas desde los videos existentes.
       Recorta automáticamente franjas negras/letterboxing para que
       los videos verticales no aparezcan con grandes bloques negros. */
    const gallery = document.getElementById("galleryGrid");
    const projects = [
      ["proyecto1.mp4","Subaru WRX 03"], ["Proyecto2.mp4","Subaru Impreza"],
      ["Proyecto3.mp4","Nissan 350Z"], ["Proyecto4.mp4","Subaru Hawk V-Limited"],
      ["Proyecto5.mp4","Track Day"], ["Proyecto6.mp4","BMW E36"],
      ["Proyecto7.mp4","Mitsubishi Triton"], ["proyecto8.mp4","STI Type RA / Type R"]
    ];

    const makeThumb = (src, title) => {
      if (!gallery) return;

      const wrap = document.createElement("button");
      wrap.type = "button";
      wrap.className = "gallery-item";
      wrap.setAttribute("aria-label", `Ver proyecto ${title}`);

      const img = document.createElement("img");
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";

      const caption = document.createElement("div");
      caption.className = "gallery-caption";
      caption.innerHTML = `<span>${title}</span><i class="fas fa-play" aria-hidden="true"></i>`;

      const video = document.createElement("video");
      video.muted = true;
      video.preload = "metadata";
      video.src = src;
      video.playsInline = true;

      let captured = false;

      const capture = () => {
        if (captured || !video.videoWidth || !video.videoHeight) return;
        captured = true;

        const sourceW = video.videoWidth;
        const sourceH = video.videoHeight;
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = sourceW;
        sourceCanvas.height = sourceH;
        const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
        sourceCtx.drawImage(video, 0, 0, sourceW, sourceH);

        /* Detecta franjas negras grandes en los bordes superior/inferior. */
        const sampleW = Math.min(320, sourceW);
        const scale = sampleW / sourceW;
        const sampleH = Math.max(1, Math.round(sourceH * scale));
        const sample = document.createElement("canvas");
        sample.width = sampleW;
        sample.height = sampleH;
        const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
        sampleCtx.drawImage(sourceCanvas, 0, 0, sampleW, sampleH);

        const pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
        const rowIsDark = row => {
          let bright = 0;
          const step = 4;
          for (let x = 0; x < sampleW; x += step) {
            const i = (row * sampleW + x) * 4;
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            const lum = (r * 299 + g * 587 + b * 114) / 1000;
            if (lum > 22) bright++;
          }
          return bright < (sampleW / step) * 0.025;
        };

        let top = 0;
        let bottom = sampleH - 1;
        while (top < Math.floor(sampleH * 0.25) && rowIsDark(top)) top++;
        while (bottom > Math.ceil(sampleH * 0.75) && rowIsDark(bottom)) bottom--;

        const cropY = Math.round(top / scale);
        const cropH = Math.max(1, Math.round((bottom - top + 1) / scale));

        /* Nunca recorta si el resultado sería demasiado agresivo. */
        const validCrop = cropH >= sourceH * 0.55;
        const finalY = validCrop ? cropY : 0;
        const finalH = validCrop ? cropH : sourceH;

        const outputW = 900;
        const outputH = 675;
        const output = document.createElement("canvas");
        output.width = outputW;
        output.height = outputH;
        const ctx = output.getContext("2d");

        /* Cover: llena el recuadro 4:3 sin deformar el vehículo. */
        const sourceRatio = sourceW / finalH;
        const targetRatio = outputW / outputH;
        let drawW, drawH, sx = 0, sy = finalY;

        if (sourceRatio > targetRatio) {
          drawH = finalH;
          drawW = finalH * targetRatio;
          sx = (sourceW - drawW) / 2;
        } else {
          drawW = sourceW;
          drawH = sourceW / targetRatio;
          sy = finalY + Math.max(0, (finalH - drawH) / 2);
        }

        ctx.drawImage(sourceCanvas, sx, sy, drawW, drawH, 0, 0, outputW, outputH);
        img.src = output.toDataURL("image/jpeg", 0.84);
        video.remove();
      };

      video.addEventListener("loadedmetadata", () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        video.currentTime = duration > 2 ? Math.min(1.5, duration * 0.2) : 0.1;
      }, { once: true });
      video.addEventListener("seeked", capture, { once: true });
      video.addEventListener("loadeddata", () => {
        if (video.readyState >= 2 && video.currentTime > 0) capture();
      }, { once: true });
      video.addEventListener("error", () => {
        img.src = "FondoP.jpg";
        video.remove();
      }, { once: true });

      wrap.append(img, caption, video);
      gallery.appendChild(wrap);
    };

    projects.forEach(([src, title]) => makeThumb(src, title));
    /* Videos: no descargar todo antes de tiempo */
    document.querySelectorAll("video").forEach(video => {
      video.setAttribute("playsinline","");
      video.setAttribute("webkit-playsinline","");
    });

    /* Preloader */
    const preloader = document.getElementById("preloader");
    if (preloader) {
      const hide = () => {
        preloader.classList.add("fade-out");
        setTimeout(() => preloader.remove(), 550);
      };
      window.addEventListener("load", () => setTimeout(hide, 900), {once:true});
      setTimeout(hide, 3500);
    }

    /* Música */
    const audio = new Audio(AUDIO_FILE);
    audio.loop = true;
    audio.volume = .4;
    const musicBtn = document.getElementById("musicToggleBtn");
    const musicIcon = document.getElementById("musicIcon");
    let playing = false;
    window.toggleAudio = async () => {
      if (playing) {
        audio.pause(); playing = false;
        musicBtn?.classList.remove("playing");
        if (musicIcon) musicIcon.className = "fas fa-music";
        return;
      }
      try {
        await audio.play();
        playing = true;
        musicBtn?.classList.add("playing");
        if (musicIcon) musicIcon.className = "fas fa-volume-high";
      } catch (e) {
        console.info("El navegador bloqueó la reproducción automática hasta una interacción.");
      }
    };
    musicBtn?.addEventListener("click", window.toggleAudio);
  });
})();
/* =========================================================
   CARRUSEL DE GALERÍA
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".gallery-track");
  const prevBtn = document.querySelector(".gallery-prev");
  const nextBtn = document.querySelector(".gallery-next");
  const dotsContainer = document.querySelector(".gallery-dots");

  if (!track) return;

  const cards = Array.from(
    track.querySelectorAll(".project-card")
  );

  if (!cards.length) return;


  /* =======================================================
     CREAR INDICADORES
  ======================================================= */

  cards.forEach((card, index) => {

    const dot = document.createElement("button");

    dot.className = "gallery-dot";

    dot.setAttribute(
      "aria-label",
      `Ir al proyecto ${index + 1}`
    );

    dot.addEventListener("click", () => {

      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });

    });

    dotsContainer.appendChild(dot);

  });


  const dots = Array.from(
    dotsContainer.querySelectorAll(".gallery-dot")
  );


  /* =======================================================
     ACTUALIZAR DOTS
  ======================================================= */

  function updateDots() {

    const scrollLeft = track.scrollLeft;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {

      const distance = Math.abs(
        card.offsetLeft - scrollLeft
      );

      if (distance < closestDistance) {

        closestDistance = distance;
        closestIndex = index;

      }

    });


    dots.forEach((dot, index) => {

      dot.classList.toggle(
        "active",
        index === closestIndex
      );

    });

  }


  /* =======================================================
     BOTÓN ANTERIOR
  ======================================================= */

  prevBtn.addEventListener("click", () => {

    const cardWidth =
      cards[0].offsetWidth +
      parseInt(
        getComputedStyle(track).gap
      );

    track.scrollBy({
      left: -cardWidth,
      behavior: "smooth"
    });

  });


  /* =======================================================
     BOTÓN SIGUIENTE
  ======================================================= */

  nextBtn.addEventListener("click", () => {

    const cardWidth =
      cards[0].offsetWidth +
      parseInt(
        getComputedStyle(track).gap
      );

    track.scrollBy({
      left: cardWidth,
      behavior: "smooth"
    });

  });


  /* =======================================================
     DETECTAR SCROLL
  ======================================================= */

  track.addEventListener(
    "scroll",
    updateDots,
    { passive: true }
  );


  /* =======================================================
     INICIALIZAR
  ======================================================= */

  updateDots();

});