// ===== TYPING EFFECT IN THE HERO =====
const words = ["apps", "games", "websites", "CAD designs", "the future"];
const typed = document.getElementById("typed");
let wordIndex = 0;
let letterIndex = words[0].length;
let deleting = true;

function typeLoop() {
    const word = words[wordIndex];

      if (deleting) {
            letterIndex--;
      } else {
            letterIndex++;
      }
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
          setTimeout(typeLoop, 1800);

          // ===== MOBILE MENU =====
          const menuBtn = document.getElementById("menuBtn");
          const navLinks = document.getElementById("navLinks");

          menuBtn.addEventListener("click", () => {
              navLinks.classList.toggle("open");
            });
          
          navLinks.querySelectorAll("a").forEach((link) => {
              link.addEventListener("click", () => navLinks.classList.remove("open"));
            });
          
          // ===== WHEN YOU SCROLL: nav shadow, progress bar, back-to-top button =====
          const nav = document.getElementById("nav");
        const progress = document.getElementById("progress");
      const toTop = document.getElementById("toTop");
    
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const total = document.body.scrollHeight - window.innerHeight;
      
        nav.classList.toggle("scrolled", scrolled > 20);
        progress.style.width = (scrolled / total) * 100 + "%";
        toTop.classList.toggle("show", scrolled > 600);
      });
    
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

                                                        // ===== COPY EMAIL BUTTON =====
                                                        const copyBtn = document.getElementById("copyBtn");
                                                        const toast = document.getElementById("toast");

                                                        copyBtn.addEventListener("click", () => {
                                                            navigator.clipboard.writeText("diab210111@diabstudents.com");
                                                              toast.classList.add("show");
                                                                setTimeout(() => toast.classList.remove("show"), 2000);
                                                        });

                                                        // ===== YEAR IN THE FOOTER =====
                                                        document.getElementById("year").textContent = new Date().getFullYear();
                                                       