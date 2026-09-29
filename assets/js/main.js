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

  /* ---------- Animações de entrada ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pequeno atraso escalonado entre itens irmãos (cards, listas).
  reveals.forEach(function (el) {
    var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
    var index = Array.prototype.indexOf.call(siblings, el);
    if (index > 0) el.style.setProperty("--delay", Math.min(index, 6) * 0.07 + "s");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Formulário de contato ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var emailReady = isSet(config.email);

  if (emailReady) {
    form.setAttribute("action", "https://formsubmit.co/" + encodeURIComponent(config.email));
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? " is-" + type : "");
  }

  function validate() {
    var firstInvalid = null;
    ["nome", "telefone"].forEach(function (name) {
      var input = form.elements[name];
      var ok = input.value.trim().length >= (name === "telefone" ? 8 : 2);
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    var emailInput = form.elements.email;
    if (emailInput.value.trim() && !emailInput.checkValidity()) {
      emailInput.setAttribute("aria-invalid", "true");
      firstInvalid = firstInvalid || emailInput;
    } else {
      emailInput.removeAttribute("aria-invalid");
    }
    var consent = form.elements.consentimento;
    consent.closest(".consent").classList.toggle("is-invalid", !consent.checked);
    if (!consent.checked && !firstInvalid) firstInvalid = consent;
    return firstInvalid;
  }

  function whatsappSummary() {
    var f = form.elements;
    var lines = ["Olá! Gostaria de agendar uma consulta."];
    lines.push("Nome: " + f.nome.value.trim());
    lines.push("Telefone: " + f.telefone.value.trim());
    if (f.email.value.trim()) lines.push("E-mail: " + f.email.value.trim());
    if (f.servico.value) lines.push("Serviço: " + f.servico.value);
    if (f.cidade.value) lines.push("Cidade: " + f.cidade.value);
    if (f.mensagem.value.trim()) lines.push("Mensagem: " + f.mensagem.value.trim());
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalid = validate();
    if (invalid) {
      setStatus("Preencha nome, telefone e autorize o contato para continuar.", "error");
      invalid.focus();
      return;
    }
    if (form.elements._honey.value) return;

    // Sem e-mail configurado, o pedido segue pelo WhatsApp.
    if (!emailReady) {
      window.open(whatsappUrl(whatsappSummary()), "_blank", "noopener");
      setStatus("Abrimos o WhatsApp com os seus dados. É só enviar a mensagem!", "success");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Enviando…");

    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(config.email), {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function () {
        form.reset();
        setStatus("Mensagem enviada! Em breve entraremos em contato para confirmar sua consulta.", "success");
      })
      .catch(function () {
        setStatus("Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.", "error");
      })
      .then(function () {
        submitBtn.disabled = false;
      });
  });
})();
