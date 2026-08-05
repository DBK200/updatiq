// Updatiq marketing site — small vanilla enhancements (no dependencies).

// Current year in the footer.
document.getElementById("year").textContent = String(new Date().getFullYear());

// Mobile nav toggle.
const nav = document.getElementById("nav");
document.getElementById("navToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

// Reveal-on-scroll for elements with .reveal.
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
