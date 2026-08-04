// Updatiq marketing site — small vanilla enhancements (no dependencies).

// Current year in the footer.
document.getElementById("year").textContent = String(new Date().getFullYear());

// Mobile nav toggle.
const nav = document.getElementById("nav");
document.getElementById("navToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

// ---------- Waitlist capture ----------
// Point this at your email store to start collecting real signups. Options:
//   • A form/email service endpoint (Formspree, Tally, Buttondown, Loops, Mailchimp) — no backend needed.
//   • Your own backend, e.g. POST /api/public/waitlist  { "email": "..." }.
// Leave empty to run in demo mode (stores locally + shows a success message).
const WAITLIST_ENDPOINT = "";

const waitlistForm = document.getElementById("waitlist");
const waitlistMsg = document.getElementById("waitlistMsg");
const waitlistInput = document.getElementById("wl-email");

function setWaitlistMsg(text, kind) {
  waitlistMsg.textContent = text;
  waitlistMsg.className = "waitlist-msg " + (kind || "");
}

waitlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = waitlistInput.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    setWaitlistMsg("Please enter a valid email address.", "err");
    waitlistInput.focus();
    return;
  }
  const btn = waitlistForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "…";
  try {
    if (WAITLIST_ENDPOINT) {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "waitlist" }),
      });
      if (!res.ok) throw new Error("bad status");
    } else {
      // Demo mode: keep it locally so the UX works before a store is wired up.
      const list = JSON.parse(localStorage.getItem("updatiq-waitlist") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("updatiq-waitlist", JSON.stringify(list));
    }
    waitlistForm.reset();
    setWaitlistMsg("You're on the list — we'll email you the moment we launch. 🎉", "ok");
  } catch {
    setWaitlistMsg("Something went wrong. Please try again.", "err");
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});

// Focus the field when arriving via a "Join the waitlist" link.
function focusWaitlist() {
  if (location.hash === "#waitlist" && waitlistInput) {
    setTimeout(() => waitlistInput.focus({ preventScroll: true }), 350);
  }
}
window.addEventListener("hashchange", focusWaitlist);
focusWaitlist();

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
