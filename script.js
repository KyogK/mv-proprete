// ===== MV Propreté – Premium interactions =====
const LIEUX = [
  "Immeubles", "Bureaux", "Fins de chantier", "Résidences", "Locaux inoccupés",
  "Salles de spectacle", "Expositions", "Hôpitaux", "Entreprises",
  "Centres commerciaux", "Magasins", "Appartements", "Entrepôts",
  "Restaurants", "Mairies & collectivités", "Groupes scolaires"
];
const MAIL = "mvpm.accueil@gmail.com";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Preloader =====
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (pre) {
    setTimeout(() => {
      pre.classList.add("is-done");
      document.body.style.overflow = "";
    }, 1600);
  }
});
document.body.style.overflow = "hidden";

// ===== Nav solid + mobile menu =====
const nav = document.getElementById("nav");
const topSection = document.getElementById("top");
if (topSection) {
  new IntersectionObserver(
    ([e]) => nav.classList.toggle("is-solid", e.intersectionRatio < 0.88),
    { threshold: [0, 0.5, 0.88, 1] }
  ).observe(topSection);
}

const burger = document.getElementById("burger");
const links = document.getElementById("navLinks");
if (burger && links) {
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  io.observe(el);
});

// ===== Marquee infinite =====
document.querySelectorAll(".marquee").forEach((row) => {
  const dir = Number(row.dataset.dir) || 1;
  const list = dir > 0 ? LIEUX : [...LIEUX].reverse();
  row.innerHTML = [...list, ...list]
    .map((l, i) => `<span class="${i % 3 === 0 ? "on" : ""}">${l}</span>`)
    .join("");

  let x = dir > 0 ? 0 : -row.scrollWidth / 2;
  const speed = 0.45;

  const step = () => {
    if (!reduce) {
      x -= speed * dir;
      const half = row.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      row.style.transform = `translate3d(${x}px,0,0)`;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});

// ===== Stats counter =====
const statsIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const num = e.target.querySelector("[data-count]");
      if (!num || num.dataset.done) return;
      num.dataset.done = "1";
      const target = parseInt(num.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();
      const animate = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        num.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      statsIo.unobserve(e.target);
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".stat").forEach((s) => statsIo.observe(s));

// ===== Form =====
const select = document.getElementById("lieuSelect");
if (select) {
  select.innerHTML =
    `<option value="" disabled selected>Choisir un type de lieu</option>` +
    LIEUX.map((l) => `<option value="${l}">${l}</option>`).join("");
}

const form = document.getElementById("devisForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const nom = f.get("nom")?.trim();
    const tel = f.get("tel")?.trim();
    const lieu = f.get("lieu");
    const besoin = f.get("besoin")?.trim() || "Non précisé";

    if (!nom || !tel || !lieu) {
      alert("Merci de remplir les champs obligatoires.");
      return;
    }

    const body = `Nom / Société : ${nom}\nTéléphone : ${tel}\nType de lieu : ${lieu}\n\nBesoin :\n${besoin}`;
    const subject = `Demande de devis – ${lieu}`;
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const btn = document.getElementById("submitBtn");
    if (btn) {
      btn.querySelector(".btn__text").textContent = "Messagerie ouverte ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.querySelector(".btn__text").textContent = "Envoyer ma demande";
        btn.disabled = false;
      }, 4000);
    }
  });
}

// ===== Sticky CTA (mobile) =====
const sticky = document.getElementById("stickyCta");
const devisSection = document.getElementById("devis");
if (sticky && devisSection) {
  const stickyIo = new IntersectionObserver(
    ([e]) => {
      // Show sticky when hero is gone and devis is not in view
      const show = !e.isIntersecting && window.scrollY > window.innerHeight * 0.6;
      sticky.classList.toggle("is-visible", show);
    },
    { threshold: 0.15 }
  );
  stickyIo.observe(devisSection);

  // Also hide when near top
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY < window.innerHeight * 0.5) {
        sticky.classList.remove("is-visible");
      }
    },
    { passive: true }
  );
}

// ===== Magnetic buttons (subtle) =====
if (!reduce && matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

// ===== SIGNATURE : vitre embuée + raclette =====
(function fogEffect() {
  const canvas = document.getElementById("fog");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, last = null, prev = null;
  const t0 = performance.now();

  const paintFog = (alpha) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(232, 240, 235, ${alpha})`;
    ctx.fillRect(0, 0, w, h);
  };

  const droplets = () => {
    ctx.globalCompositeOperation = "source-over";
    const count = Math.floor((w * h) / 650);
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.45})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.9 + 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFog(0.88);
    droplets();
  };

  const wipe = (x0, y0, x1, y1, size) => {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const move = (e) => {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    const x = p.clientX - r.left;
    const y = p.clientY - r.top;
    if (x < 0 || y < 0 || x > w || y > h) {
      last = null;
      return;
    }
    if (last) {
      const size = w < 700 ? 65 : 115;
      wipe(last.x, last.y, x, y, size);
    }
    last = { x, y };
  };

  // Intro wipe (vertical stroke)
  const intro = (now) => {
    const p = Math.min(Math.max((now - t0 - 700) / 1500, 0), 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const x = w * (w < 700 ? 0.5 : 0.68);
    const y = -30 + (h + 60) * ease;
    if (prev !== null && p > 0) {
      wipe(x, prev, x, y, w < 700 ? 150 : 280);
    }
    prev = y;
    return p < 1;
  };

  resize();
  let running = true;
  const loop = (now) => {
    if (running) running = intro(now);
    if (!reduce) paintFog(0.0028); // fog slowly returns
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  addEventListener("resize", resize);
  addEventListener("pointermove", move, { passive: true });
  addEventListener("touchmove", move, { passive: true });
})();

// ===== Signature / Chanson =====
const playBtn = document.getElementById("playChanson");
const lyrics = document.getElementById("chansonLyrics");
const icon = document.getElementById("chansonIcon");

if (playBtn && lyrics) {
  let playing = false;
  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.classList.toggle("is-playing", playing);
    lyrics.classList.toggle("is-visible", playing);
    icon.textContent = playing ? "❚❚" : "▶";
    
    // Auto-reset after animation
    if (playing) {
      setTimeout(() => {
        if (playing) {
          playing = false;
          playBtn.classList.remove("is-playing");
          icon.textContent = "▶";
        }
      }, 8000);
    }
  });
}
