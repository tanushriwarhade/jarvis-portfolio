/* ═══════════════════════════════════════════════════════════
   TANUSHRI WARHADE — PORTFOLIO SCRIPT
   Handles: particles, typing, counters, scroll, navbar,
            skill rings, contact form, mouse glow, timeline
═══════════════════════════════════════════════════════════ */

'use strict';

// ── DOMContentLoaded GATE ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initNavbar();
  initMouseGlow();
  initScrollReveal();
  initSkillRings();
  initCounters();
  initTimeline();
  initContactForm();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════════════════
   1. PARTICLE CANVAS
══════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  // Particle config
  const COUNT      = Math.min(Math.floor(window.innerWidth / 8), 160);
  const COLORS     = ['rgba(0,240,255,', 'rgba(0,163,255,', 'rgba(0,240,255,'];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.r  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      // Fade in/out
      const progress = this.life / this.maxLife;
      this.currentAlpha = this.alpha * Math.sin(progress * Math.PI);
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentAlpha + ')';
      ctx.fill();
    }
  }

  // Connecting lines between nearby particles
  function drawConnections() {
    const DIST = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  buildParticles();

  let animId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════════════════════════════════
   2. JARVIS TYPING EFFECT
══════════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('jarvisTyped');
  if (!el) return;

  const messages = [
    "Hello. I am JARVIS. Tanushri's portfolio is now online.",
    "All systems are operational. Loading project files...",
    "Full Stack Developer. Python. React. Node.js. Django.",
    "Available for new missions. Awaiting your transmission.",
  ];

  let msgIndex  = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPausing  = false;

  function tick() {
    const current = messages[msgIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 30);
    } else {
      el.textContent = current.slice(0, charIndex);
      charIndex++;
      if (charIndex > current.length) {
        if (!isPausing) {
          isPausing = true;
          setTimeout(() => { isPausing = false; isDeleting = true; tick(); }, 2800);
          return;
        }
      }
      setTimeout(tick, 52);
    }
  }

  // Start after hero animation delay
  setTimeout(tick, 1600);
}

/* ══════════════════════════════════════════════════════════
   3. NAVBAR — scroll + mobile toggle
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll effect
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastY = y;
    updateActiveLink();
  }, { passive: true });

  // Active link highlighting
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 120;
    let active     = null;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
        active = sec.id;
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
    });
  }

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   4. MOUSE GLOW
══════════════════════════════════════════════════════════ */
function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  let animating = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!animating) {
      animating = true;
      requestAnimationFrame(followMouse);
    }
  });

  function followMouse() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    animating = false;
  }

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

/* ══════════════════════════════════════════════════════════
   5. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.07}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   6. SKILL RING FILL ANIMATION
══════════════════════════════════════════════════════════ */
function initSkillRings() {
  const CIRCUMFERENCE = 2 * Math.PI * 50; // r=50

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const ring = card.querySelector('.ring-fill');
        if (!ring) return;

        const percent = parseFloat(ring.dataset.percent) || 0;
        const offset  = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

        // Slight delay for cinematic feel
        requestAnimationFrame(() => {
          ring.style.strokeDashoffset = offset;
        });

        observer.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
}

/* ══════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS
══════════════════════════════════════════════════════════ */
function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card   = entry.target;
      const numEl  = card.querySelector('.stat-number');
      if (!numEl || numEl.dataset.animated) return;

      const target   = parseInt(numEl.dataset.count, 10);
      const duration = 1800;
      const start    = performance.now();

      numEl.dataset.animated = 'true';

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        numEl.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else numEl.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(card);
    });
  }, { threshold: 0.5 });

  statCards.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════════════════
   8. TIMELINE LINE FILL
══════════════════════════════════════════════════════════ */
function initTimeline() {
  const fill = document.querySelector('.timeline-line-fill');
  if (!fill) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.classList.add('animated');
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const timeline = document.querySelector('.timeline');
  if (timeline) observer.observe(timeline);
}

/* ══════════════════════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════════════════════ */
// function initContactForm() {
//   const form       = document.getElementById('contactForm');
//   const btn        = document.getElementById('submitBtn');
//   const successMsg = document.getElementById('formSuccess');
//   if (!form) return;

//   form.addEventListener('submit', e => {
//     e.preventDefault();

//     // Simple client-side validation
//     const inputs = form.querySelectorAll('[required]');
//     let valid = true;
//     inputs.forEach(input => {
//       if (!input.value.trim()) {
//         valid = false;
//         input.classList.add('error');
//         input.addEventListener('input', () => input.classList.remove('error'), { once: true });
//       }
//     });
//     if (!valid) return;

//     // Simulate send
//     btn.classList.add('sending');
//     btn.disabled = true;

//     setTimeout(() => {
//       btn.classList.remove('sending');
//       btn.disabled = false;
//       successMsg.classList.add('visible');
//       form.reset();

//       setTimeout(() => successMsg.classList.remove('visible'), 5000);
//     }, 1800);
//   });
// }
// server.js

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {

  const { name, email, subject, message } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tanuwarhade@gmail.com",
        pass: "Tanshri@0303",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "tanuwarhade @gmail.com",
      subject: subject,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
/* ══════════════════════════════════════════════════════════
   10. SMOOTH SCROLL (for older browsers)
══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   11. BONUS: Animated border glow on glass cards (mousemove)
══════════════════════════════════════════════════════════ */
(function initCardGlow() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,240,255,0.055) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   12. HERO REACTOR — subtle mouse parallax
══════════════════════════════════════════════════════════ */
(function initReactorParallax() {
  const reactor = document.querySelector('.hero-reactor');
  if (!reactor || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    reactor.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  });
})();

/* ══════════════════════════════════════════════════════════
   13. HERO NAME — glitch flash on hover (subtle)
══════════════════════════════════════════════════════════ */
(function initNameGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  name.addEventListener('mouseenter', () => {
    name.style.textShadow = `
      2px 0 0 rgba(255,0,51,0.4),
      -2px 0 0 rgba(0,240,255,0.6),
      0 0 40px rgba(0,240,255,0.5)
    `;
    setTimeout(() => {
      name.style.textShadow = '';
    }, 180);
  });
})();

/* ══════════════════════════════════════════════════════════
   14. FORM INPUT LABELS — float effect
══════════════════════════════════════════════════════════ */
(function initFloatLabels() {
  document.querySelectorAll('.form-input').forEach(input => {
    // Glow on focus
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('.form-label')?.style &&
        (input.parentElement.querySelector('.form-label').style.color = 'var(--cyan)');
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('.form-label')?.style &&
        (input.parentElement.querySelector('.form-label').style.color = '');
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   15. PERFORMANCE: Pause animations when tab hidden
══════════════════════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  const rings = document.querySelectorAll('.reactor-ring, .av-ring, .stat-icon');
  rings.forEach(el => {
    el.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
});
