/* Clínica Odontológica Alexsandra & Antônio Prado — interações do site */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var config = window.CLINICA_CONFIG || {};
  var WHATSAPP_FALLBACK = "5579998096738";

  // Um valor ainda não configurado continua entre colchetes, ex.: "[EMAIL]".
  function isSet(value) {
    var v = String(value || "").trim();
    return v !== "" && !/^\[.*\]$/.test(v);
  }

  /* ---------- WhatsApp ---------- */
  function whatsappUrl(message) {
    var digits = String(config.whatsapp || "").replace(/\D/g, "");
    var number = digits.length >= 12 ? digits : WHATSAPP_FALLBACK;
    var text = message || config.whatsappMessage || "";
    return "https://wa.me/" + number + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", whatsappUrl(el.getAttribute("data-whatsapp")));
  });
  if (config.whatsappDisplay) {
    document.querySelectorAll("[data-whatsapp-display]").forEach(function (el) {
      el.textContent = config.whatsappDisplay;
    });
  }
  if (config.phone) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.setAttribute("href", "tel:" + config.phone);
    });
  }

  /* ---------- E-mail, endereço e Instagram ---------- */
  if (isSet(config.email)) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + config.email);
    });
    document.querySelectorAll("[data-email-label]").forEach(function (el) {
      el.textContent = config.email;
    });
  }

  if (isSet(config.address)) {
    document.querySelectorAll("[data-address]").forEach(function (el) {
      el.textContent = config.address;
    });
  }

  if (isSet(config.instagram)) {
    document.querySelectorAll("[data-instagram]").forEach(function (el) {
      el.setAttribute("href", config.instagram);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-instagram-label]").forEach(function (el) {
      var handle = config.instagram.replace(/\/+$/, "").split("/").pop();
      el.textContent = handle ? "@" + handle : "";
      el.classList.remove("placeholder");
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Google Maps (carregado só quando se aproxima da tela) ---------- */
  var mapSlot = document.querySelector("[data-map]");
  var mapSrc = isSet(config.mapsEmbedUrl)
    ? config.mapsEmbedUrl
    : isSet(config.address)
      ? "https://www.google.com/maps?q=" + encodeURIComponent(config.address) + "&output=embed"
      : "";

  function loadMap() {
    var iframe = document.createElement("iframe");
    iframe.src = mapSrc;
    iframe.title = "Mapa com a localização da Clínica Odontológica Alexsandra & Antônio Prado";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    mapSlot.replaceWith(iframe);
  }

  if (mapSlot && mapSrc) {
    if ("IntersectionObserver" in window) {
      var mapObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          mapObserver.disconnect();
          loadMap();
        }
      }, { rootMargin: "400px 0px" });
      mapObserver.observe(mapSlot);
    } else {
      loadMap();
    }
  }

  /* ---------- Cabeçalho e botão flutuante ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.querySelector(".wa-float");
  var hero = document.querySelector(".hero");
  var contact = document.getElementById("contato");
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    if (waFloat && hero) {
      // Aparece depois do hero e some na seção de contato (que já tem o botão).
      var pastHero = y > hero.offsetHeight * 0.55;
      var rect = contact ? contact.getBoundingClientRect() : null;
      var inContact = rect && rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      waFloat.classList.toggle("is-hidden", !pastHero || inContact);
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu");
  var desktop = window.matchMedia("(min-width: 1200px)");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    desktop.addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Animações de entrada (ao rolar) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canObserve = "IntersectionObserver" in window;
  var REVEAL_CLASSES = ["reveal", "reveal--left", "reveal--right", "reveal--zoom", "reveal--rise", "reveal--clip"];

  // Pequeno atraso escalonado entre itens irmãos (cards, listas).
  reveals.forEach(function (el) {
    var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
    var index = Array.prototype.indexOf.call(siblings, el);
    if (index > 0) el.style.setProperty("--delay", Math.min(index, 8) * 0.08 + "s");
  });

  function show(el) {
    el.classList.add("is-visible");
    // Terminada a entrada, remove as classes de animação para liberar os efeitos de hover.
    var delay = parseFloat(el.style.getPropertyValue("--delay")) || 0;
    window.setTimeout(function () {
      el.classList.remove.apply(el.classList, REVEAL_CLASSES);
    }, delay * 1000 + 2000);
  }

  if (reduceMotion || !canObserve) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contadores (8 áreas, 4 cidades, 2 dentistas) ---------- */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1400;
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var progress = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    el.textContent = "0";
    window.requestAnimationFrame(step);
  }

  if (!reduceMotion && canObserve && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          window.setTimeout(function () { runCounter(entry.target); }, 400);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Barra de progresso e parallax suave ---------- */
  var progressBar = document.querySelector(".scroll-progress");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var parallaxMq = window.matchMedia("(min-width: 768px)");
  var motionTicking = false;

  function updateMotion() {
    motionTicking = false;
    var vh = window.innerHeight;
    if (progressBar) {
      var max = document.documentElement.scrollHeight - vh;
      progressBar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    }
    var enabled = parallaxMq.matches;
    parallaxEls.forEach(function (el) {
      if (!enabled) { el.style.transform = ""; return; }
      // Usa o elemento pai como referência para não medir o próprio deslocamento.
      var rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      var offset = (rect.top + rect.height / 2 - vh / 2) * parseFloat(el.getAttribute("data-parallax"));
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  if (!reduceMotion) {
    window.addEventListener("scroll", function () {
      if (!motionTicking) {
        motionTicking = true;
        window.requestAnimationFrame(updateMotion);
      }
    }, { passive: true });
    window.addEventListener("resize", updateMotion);
    updateMotion();
  }

  /* ---------- Menu: destaca a seção visível ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav ul a[href^="#"]'));
  if (canObserve && navLinks.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          var active = a.getAttribute("href") === id;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (sec) { spyObserver.observe(sec); });
  }
})();
