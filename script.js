// ── Animated Gradient Orbs Background ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const orbs = [
  { x: 0.15, y: 0.2,  r: 0.35, color: [149, 76, 233],  dx: 0.00012, dy: 0.00008  },
  { x: 0.75, y: 0.6,  r: 0.3,  color: [240, 89, 218],   dx: -0.0001, dy: 0.00012  },
  { x: 0.5,  y: 0.85, r: 0.25, color: [59,  130, 246],  dx: 0.00008, dy: -0.00015 },
  { x: 0.88, y: 0.15, r: 0.2,  color: [6,   182, 212],  dx: -0.00013,dy: 0.0001   },
];

let t = 0;
function drawOrbs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  t += 1;

  orbs.forEach(orb => {
    orb.x += orb.dx * Math.sin(t * 0.5);
    orb.y += orb.dy * Math.cos(t * 0.4);
    if (orb.x < 0 || orb.x > 1) orb.dx *= -1;
    if (orb.y < 0 || orb.y > 1) orb.dy *= -1;

    const cx = orb.x * canvas.width;
    const cy = orb.y * canvas.height;
    const radius = orb.r * Math.min(canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(${orb.color.join(',')}, 0.18)`);
    grad.addColorStop(1, `rgba(${orb.color.join(',')}, 0)`);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  });

  requestAnimationFrame(drawOrbs);
}
drawOrbs();

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

// ── Active Nav on Scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#f0f0ff' : '';
  });
}, { passive: true });

// ── Smooth number count-up for stat cards ──
function countUp(el, target, suffix) {
  const isFloat = target % 1 !== 0;
  let start = 0;
  const dur = 1400;
  const step = 16;
  const inc = target / (dur / step);
  const timer = setInterval(() => {
    start = Math.min(start + inc, target);
    el.textContent = isFloat ? start.toFixed(1) : Math.floor(start);
    if (start >= target) {
      el.textContent = isFloat ? target.toFixed(1) : target;
      clearInterval(timer);
    }
  }, step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const card = e.target;
      const valEl = card.querySelector('.stat-value');
      const plusSuffix = valEl.querySelector('span')?.textContent || '';
      const fullText = valEl.childNodes[0]?.textContent?.trim() || '';
      const letterMatch = fullText.match(/^(\d+\.?\d*)([A-Za-z]*)$/);
      if (letterMatch) {
        const num = parseFloat(letterMatch[1]);
        const letterSuffix = letterMatch[2]; // e.g. "M", "K"
        valEl.innerHTML = `<span class="count">0</span>${letterSuffix}<span>${plusSuffix}</span>`;
        countUp(valEl.querySelector('.count'), num, '');
      }
      statObserver.unobserve(card);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(c => statObserver.observe(c));
