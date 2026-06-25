// ==========================================================
// Slide Navigation — Genealogical Likelihood Presentation
// ==========================================================

const slides = Array.from(document.querySelectorAll(".slide"));
let currentSlide = 0;


// ==========================================================
// Elements
// ==========================================================

const counter  = document.getElementById("slide-counter");
const progBar  = document.getElementById("progress-bar");
const navEl    = document.getElementById("slide-nav");


// ==========================================================
// Build Nav Dots
// ==========================================================

slides.forEach((slide, i) => {
  const dot = document.createElement("button");
  dot.className  = "nav-dot";
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.setAttribute("data-label", slide.dataset.label || `Slide ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  navEl.appendChild(dot);
});

const dots = Array.from(navEl.querySelectorAll(".nav-dot"));


// ==========================================================
// Go To Slide
// ==========================================================

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;
  slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
  updateUI();
}


// ==========================================================
// Next / Previous
// ==========================================================

function nextSlide() {
  if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
}

function previousSlide() {
  if (currentSlide > 0) goToSlide(currentSlide - 1);
}


// ==========================================================
// Update Counter, Progress, Dots
// ==========================================================

function updateUI() {
  const n = slides.length;
  const i = currentSlide;

  counter.textContent = `${i + 1} / ${n}`;
  progBar.style.width = `${((i + 1) / n) * 100}%`;

  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
}


// ==========================================================
// Scroll → track active slide + fade-in
// ==========================================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // fade in
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

slides.forEach(s => observer.observe(s));

// scroll-based active tracking (separate observer)
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = slides.indexOf(entry.target);
      if (idx !== -1 && idx !== currentSlide) {
        currentSlide = idx;
        updateUI();
      }
    }
  });
}, { threshold: 0.5 });

slides.forEach(s => activeObserver.observe(s));


// ==========================================================
// Keyboard Controls
// ==========================================================

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
    case "PageDown":
    case " ":
      e.preventDefault();
      nextSlide();
      break;
    case "ArrowLeft":
    case "ArrowUp":
    case "PageUp":
      e.preventDefault();
      previousSlide();
      break;
    case "Home":
      e.preventDefault();
      goToSlide(0);
      break;
    case "End":
      e.preventDefault();
      goToSlide(slides.length - 1);
      break;
    case "f":
    case "F":
      toggleFullscreen();
      break;
  }
});


// ==========================================================
// Mouse Wheel Navigation
// ==========================================================

let wheelCooldown = false;

window.addEventListener("wheel", (e) => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 600);

  if (e.deltaY > 30)       nextSlide();
  else if (e.deltaY < -30) previousSlide();
}, { passive: true });


// ==========================================================
// Click — right half → next, left half → previous
// (skip clicks on interactive elements)
// ==========================================================

document.addEventListener("click", (e) => {
  const tag = e.target.tagName.toLowerCase();
  const skip = ["button", "a", "input", "select", "textarea"];
  if (skip.includes(tag)) return;
  if (e.target.closest(".nav-dot")) return;

  if (e.clientX > window.innerWidth / 2) nextSlide();
  else previousSlide();
});


// ==========================================================
// Touch swipe support
// ==========================================================

let touchStartY = null;
let touchStartX = null;

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (touchStartY === null) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
    if (dy > 0) nextSlide();
    else previousSlide();
  }
  touchStartY = null;
  touchStartX = null;
});


// ==========================================================
// Fullscreen
// ==========================================================

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}


// ==========================================================
// Initial Setup
// ==========================================================

updateUI();
slides[0].classList.add("visible");
goToSlide(0);
