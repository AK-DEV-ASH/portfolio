const projects = {
  mpath: {
    category: "01 — HEALTHCARE / AI",
    title: "M-Path",
    description: "A new and improved healthcare infrastructure platform, with AI at its core.",
    idea: "M-Path is an exploration of how an AI-powered platform could help create a more connected, accessible healthcare infrastructure."
  },
  ner: {
    category: "02 — LOGISTICS / AI",
    title: "NER",
    description: "An AI logistics platform designed to help drivers in the North Eastern region find safer routes.",
    idea: "The concept helps truck drivers navigate around disaster zones and traffic, with safety and regional conditions guiding the journey."
  },
  learning: {
    category: "03 — EDUCATION / PLATFORM",
    title: "Online Learning Platform",
    description: "A school management platform connecting students and teaching staff.",
    idea: "A shared digital space where students and teaching staff can access the tools and information they need for school management."
  }
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");
const nav = document.querySelector(".primary-nav");
const menuToggle = document.querySelector(".menu-toggle");
const dialog = document.querySelector(".project-dialog");
const heroWorld = document.querySelector(".hero-world");
const scanToggle = document.querySelector("#scan-toggle");
const scrollMeter = document.querySelector("#scroll-meter");
const cityClock = document.querySelector("#city-clock");
let lastFocusedElement = null;
const questToggle = document.querySelector(".hud-toggle");
const questPanel = document.querySelector("#quest-panel");
const questToast = document.querySelector(".quest-toast");
const completedQuests = new Set();
let toastTimeout = 0;

const questLabels = {
  about: "Builder discovered",
  work: "Project zone entered",
  contact: "Final checkpoint reached",
  mpath: "M-Path scanned",
  ner: "NER scanned",
  learning: "Learning platform scanned"
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

scanToggle.addEventListener("click", () => {
  const isActive = scanToggle.getAttribute("aria-pressed") !== "true";
  scanToggle.setAttribute("aria-pressed", String(isActive));
  scanToggle.querySelector("strong").textContent = isActive ? "ON" : "OFF";
  document.body.classList.toggle("scan-mode", isActive);
});

questToggle.addEventListener("click", () => {
  const isExpanded = questToggle.getAttribute("aria-expanded") === "true";
  questToggle.setAttribute("aria-expanded", String(!isExpanded));
  questPanel.hidden = isExpanded;
});

function completeQuest(id) {
  if (!questLabels[id] || completedQuests.has(id)) return;
  completedQuests.add(id);

  const questItem = document.querySelector(`[data-quest="${id}"]`);
  questItem.classList.add("is-complete");
  questItem.querySelector(".quest-check").textContent = "✓";

  const count = completedQuests.size;
  document.querySelector("#quest-count").textContent = count;
  document.querySelector("#quest-xp").textContent = `${count * 20} XP`;
  document.querySelector("#quest-progress").style.width = `${(count / 6) * 100}%`;
  const rank = count >= 6 ? "RANK 04 · BUILDER" :
    count >= 4 ? "RANK 03 · PATHFINDER" :
      count >= 2 ? "RANK 02 · EXPLORER" : "RANK 01 · ROOKIE";
  document.querySelector("#quest-rank").textContent = rank;

  window.clearTimeout(toastTimeout);
  questToast.textContent = `+20 XP · ${questLabels[id]}`;
  toastTimeout = window.setTimeout(() => {
    questToast.textContent = "";
  }, 2600);

  if (count === 6) document.querySelector(".quest-complete").hidden = false;
}

document.querySelectorAll(".intro-section, .work-section, .contact-section").forEach((section) => {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        completeQuest(entry.target.id);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sectionObserver.observe(section);
});

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => openProject(card, card.dataset.project));

  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--tilt-x", `${-y * 3}deg`);
    card.style.setProperty("--tilt-y", `${x * 3}deg`);
    card.classList.add("is-tilting");
  });
  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

document.querySelectorAll("[data-world-project]").forEach((beacon) => {
  beacon.addEventListener("click", () => openProject(beacon, beacon.dataset.worldProject));
});

function openProject(trigger, projectId) {
  const project = projects[projectId];
  if (!project) return;
  completeQuest(projectId);
  document.querySelectorAll(`[data-project="${projectId}"]`).forEach((card) => {
    card.classList.add("is-scanned");
    card.querySelector(".project-open").textContent = "✓";
  });
  document.querySelector(`[data-world-project="${projectId}"]`)?.classList.add("is-scanned");
  lastFocusedElement = trigger;
  dialog.querySelector(".dialog-kicker").textContent = project.category;
  dialog.querySelector("#dialog-title").textContent = project.title;
  dialog.querySelector(".dialog-description").textContent = project.description;
  dialog.querySelector(".dialog-idea").textContent = project.idea;
  dialog.showModal();
  document.body.classList.add("dialog-open");
  dialog.querySelector(".dialog-close").focus();
}

heroWorld.addEventListener("pointermove", (event) => {
  if (reducedMotion || event.pointerType !== "mouse") return;
  const bounds = heroWorld.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  heroWorld.style.setProperty("--city-tilt-x", `${x * 5}deg`);
  heroWorld.style.setProperty("--city-tilt-y", `${y * -4}deg`);
});

heroWorld.addEventListener("pointerleave", () => {
  heroWorld.style.removeProperty("--city-tilt-x");
  heroWorld.style.removeProperty("--city-tilt-y");
});

function closeDialog() {
  if (!dialog.open) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
  lastFocusedElement?.focus();
}

dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  lastFocusedElement?.focus();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
});

document.querySelector("#year").textContent = new Date().getFullYear();

function updateCityClock() {
  cityClock.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(new Date());
}

updateCityClock();
window.setInterval(updateCityClock, 1000);

const parallaxElements = [...document.querySelectorAll("[data-parallax]")];
let scrollUpdateScheduled = false;

function updateScrollScene() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollMeter.style.width = `${Math.min(100, Math.max(0, progress))}%`;

  parallaxElements.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    const depth = Number(element.dataset.parallax);
    const distanceFromCenter = bounds.top + bounds.height / 2 - window.innerHeight / 2;
    element.style.setProperty("--parallax-offset", `${-distanceFromCenter * depth}px`);
  });
  scrollUpdateScheduled = false;
}

window.addEventListener("scroll", () => {
  if (scrollUpdateScheduled) return;
  scrollUpdateScheduled = true;
  window.requestAnimationFrame(updateScrollScene);
}, { passive: true });
updateScrollScene();

const canvas = document.querySelector(".particle-field");
const context = canvas.getContext("2d");
let particles = [];
let animationFrame = 0;
const pointer = { x: -1000, y: -1000 };

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 17000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    radius: Math.random() * 1.2 + 0.5
  }));
}

function drawParticles() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  particles.forEach((particle, index) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distanceToPointer = Math.hypot(dx, dy);
    if (distanceToPointer < 115 && distanceToPointer > 0) {
      particle.x -= dx / distanceToPointer * 0.15;
      particle.y -= dy / distanceToPointer * 0.15;
    }
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(49, 245, 255, 0.7)";
    context.fill();

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
      if (distance < 105) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.strokeStyle = `rgba(255, 55, 213, ${(1 - distance / 105) * 0.13})`;
        context.stroke();
      }
    }
  });
  if (!reducedMotion) animationFrame = window.requestAnimationFrame(drawParticles);
}

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
}, { passive: true });

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(animationFrame);
  resizeCanvas();
  if (!reducedMotion) drawParticles();
}, { passive: true });

resizeCanvas();
drawParticles();
