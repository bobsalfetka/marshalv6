/* ── PRELOADER ── */
const preloader = document.querySelector('.preloader');
const pchars = document.querySelectorAll('.preloader-char');
if (preloader) {
  let i = 0;
  const showChars = () => {
    if (i < pchars.length) { pchars[i].style.transform = 'translateY(0)'; i++; setTimeout(showChars, 80); }
    else { setTimeout(() => preloader.classList.add('gone'), 500); }
  };
  setTimeout(showChars, 100);
}

/* ── CURSOR ── */
const cur = document.querySelector('.cur');
if (cur) {
  const ring = cur.querySelector('.cur-ring');
  const dot = cur.querySelector('.cur-dot');
  let rx = 0, ry = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
  const loopCur = () => {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loopCur);
  };
  loopCur();
  document.querySelectorAll('a,button,.srv-row,.srv-page-entry,.case-card,.rev-c,.blog-c,.pfol-card,.mini-rev-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
  // dark section tracking
  const darkSections = document.querySelectorAll('.full-dark,.reviews-big,.srv-strip,.footer,.mob');
  const io0 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) document.body.classList.add('on-dark');
      else {
        const anyDark = [...darkSections].some(s => {
          const r = s.getBoundingClientRect();
          return r.top < window.innerHeight/2 && r.bottom > window.innerHeight/2;
        });
        if (!anyDark) document.body.classList.remove('on-dark');
      }
    });
  }, { threshold: 0.1 });
  darkSections.forEach(s => io0.observe(s));
}

/* ── NAV ── */
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const mob = document.querySelector('.mob');
if (burger && mob) {
  burger.addEventListener('click', () => { mob.classList.toggle('open'); });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));
}
// nav dark on dark sections
const navDarkSections = document.querySelectorAll('.reviews-big,.srv-strip,.footer');
const io1 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) nav && nav.classList.add('dark');
    else {
      const anyDark = [...navDarkSections].some(s => {
        const r = s.getBoundingClientRect();
        return r.top < 68 && r.bottom > 0;
      });
      if (!anyDark) nav && nav.classList.remove('dark');
    }
  });
}, { threshold: 0, rootMargin: '-68px 0px 0px 0px' });
navDarkSections.forEach(s => io1.observe(s));

/* ── SCROLL REVEAL ── */
const io2 = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io2.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('[data-r]').forEach(el => io2.observe(el));

/* ── COUNTER ── */
const counters = document.querySelectorAll('[data-count]');
const io3 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    io3.unobserve(e.target);
    const target = parseFloat(e.target.dataset.count);
    const isDecimal = String(target).includes('.');
    const dur = 1600, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      e.target.textContent = isDecimal ? val.toFixed(1) : Math.round(val) + (e.target.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
counters.forEach(c => io3.observe(c));

/* ── MARQUEE CLONE ── */
document.querySelectorAll('.marquee-inner').forEach(el => {
  const clone = el.cloneNode(true);
  el.parentElement.appendChild(clone);
});

/* ── HORIZONTAL DRAG ── */
document.querySelectorAll('.pfol-track').forEach(track => {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown = true; track.classList.add('dragging'); startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  document.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - track.offsetLeft; track.scrollLeft = scrollLeft - (x - startX); });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*0.2}px,${y*0.2}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ── VK CLIP LAZY AUTOPLAY ── */
document.querySelectorAll('.clip-frame').forEach(wrap => {
  const iframe = wrap.querySelector('iframe');
  if (!iframe) return;
  const src = iframe.src;
  iframe.src = src.replace('autoplay=1','autoplay=0');
  const io4 = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { iframe.src = src; io4.disconnect(); }
  }, { threshold: 0.25 });
  io4.observe(wrap);
});

/* ── HERO TITLE PARALLAX ── */
const heroTitle = document.querySelector('.hero-main-title');
if (heroTitle) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroTitle.style.transform = `translateY(${y * 0.18}px)`;
  }, { passive: true });
}

/* ── SPLIT TEXT REVEAL ── */
document.querySelectorAll('.split-word').forEach(container => {
  const words = container.textContent.trim().split(' ');
  container.textContent = '';
  words.forEach((word, wi) => {
    const span = document.createElement('span');
    span.style.cssText = 'display:inline-block;overflow:hidden;margin-right:0.3em;vertical-align:bottom';
    const inner = document.createElement('span');
    inner.textContent = word;
    inner.style.cssText = `display:inline-block;transform:translateY(110%);transition:transform 1s cubic-bezier(0.16,1,0.3,1);transition-delay:${wi * 0.09}s`;
    span.appendChild(inner);
    container.appendChild(span);
    if (wi < words.length - 1) container.appendChild(document.createTextNode(' '));
  });
  const io5 = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      container.querySelectorAll('span > span').forEach(s => s.style.transform = 'translateY(0)');
      io5.disconnect();
    }
  }, { threshold: 0.3 });
  io5.observe(container);
});
