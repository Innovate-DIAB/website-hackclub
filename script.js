// People who turned on "reduce motion" on their device
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== TYPING EFFECT IN THE HERO =====
const words = ["apps", "games", "websites", "AI tools", "CAD designs", "the future"];
const typed = document.getElementById("typed");
let wordIndex = 0;
let letterIndex = words[0].length;
let deleting = true;

function typeLoop() {
    const word = words[wordIndex];
    letterIndex += deleting ? -1 : 1;
    typed.textContent = word.slice(0, letterIndex);

    let speed = deleting ? 60 : 110;

    if (!deleting && letterIndex === word.length) {
        deleting = true;
        speed = 1800; // pause on the full word
    } else if (deleting && letterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
    }

    setTimeout(typeLoop, speed);
}
if (!reduceMotion) setTimeout(typeLoop, 1800);

// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.textContent = open ? "✕" : "☰";
}

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!navLinks.classList.contains("open"));
});

// Close the menu when a link is tapped, when tapping outside it, or on Escape
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target)) setMenu(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
        setMenu(false);
        menuBtn.focus();
    }
});

// ===== WHEN YOU SCROLL: nav shadow, progress bar, back-to-top button =====
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");

function onScroll() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    nav.classList.toggle("scrolled", scrolled > 20);
    progress.style.width = total > 0 ? (scrolled / total) * 100 + "%" : "0%";
    toTop.classList.toggle("show", scrolled > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== HIGHLIGHT THE NAV LINK FOR THE SECTION YOU'RE READING =====
const navSectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navSectionLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
    });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

// ===== FAQ: only keep one question open at a time =====
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
        if (item.open) {
            faqItems.forEach((other) => {
                if (other !== item) other.open = false;
            });
        }
    });
});

// ===== COUNT-UP NUMBERS =====
function countUp(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
        el.textContent = target + suffix;
        return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + suffix;
    }, 30);
}

// ===== FADE IN SECTIONS AS YOU SCROLL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.querySelectorAll("[data-count]").forEach(countUp);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ===== MEETING COUNTDOWN ON THE BULLETIN BOARD =====
// Change data-date="YYYY-MM-DD" in index.html and this updates by itself.
const badge = document.getElementById("meetingBadge");
if (badge) {
    const [y, m, d] = badge.dataset.date.split("-").map(Number);
    const meeting = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((meeting - today) / 86400000);

    if (days > 1) badge.textContent = "In " + days + " days";
    else if (days === 1) badge.textContent = "Tomorrow!";
    else if (days === 0) badge.textContent = "Today!";
    else {
        badge.textContent = "Done ✓";
        badge.classList.add("past");
    }
}

// ===== COPY EMAIL BUTTON =====
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");
const email = "diab210111@diabstudents.com";

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied!");
    } catch {
        showToast("Couldn't copy. The email is " + email);
    }
});

// ===== YEAR IN THE FOOTER =====
document.getElementById("year").textContent = new Date().getFullYear();
