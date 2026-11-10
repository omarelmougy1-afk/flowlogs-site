// Landing page motion that needs a script: blocks that rise once as they come into view,
// section headings that arrive word by word, the tour capture loading only when it is
// near, screenshots that lean towards the pointer, and a language menu that closes the way
// a menu should. All motion stays off when the visitor asks for reduced motion; the tour
// itself runs on CSS scroll-driven animation (motion.css).
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (const tour of document.querySelectorAll('.fl-tour-live')) {
    const near = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        tour.classList.add('is-near');
        near.disconnect();
      },
      { rootMargin: '150% 0px' },
    );
    near.observe(tour);
  }

  if (!calm) {
    document.documentElement.classList.add('fl-js');
    // Cards side by side arrive one after another rather than all at once.
    const blocks = [...document.querySelectorAll('[data-reveal]')];
    for (const parent of new Set(blocks.map(el => el.parentElement))) {
      const items = [...parent.children].filter(el => el.hasAttribute('data-reveal'));
      if (items.length > 1) items.forEach((el, i) => el.style.setProperty('--i', Math.min(i, 5)));
    }
    // Section headings rise word by word. Only plain-text headings are split.
    for (const heading of document.querySelectorAll('h2[data-reveal]')) {
      if (heading.children.length) continue;
      const words = heading.textContent.trim().split(/\s+/);
      heading.setAttribute('aria-label', heading.textContent.trim());
      heading.textContent = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'fl-w';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--w', Math.min(i, 12));
        span.textContent = word;
        heading.append(span, i < words.length - 1 ? ' ' : '');
      });
      heading.classList.add('fl-words');
    }
    const reveal = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const block of blocks) reveal.observe(block);
  }

  // Screenshots lean a few degrees towards the mouse pointer.
  if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const shots = document.querySelectorAll('img[src*="team-timesheet"], img[src*="flow-report"], img[src*="pdf-report"]');
    for (const img of shots) {
      if (img.closest('.fl-tour')) continue;
      const host = img.closest('[data-reveal]')?.parentElement || img.parentElement;
      host.classList.add('fl-tilt');
      host.addEventListener('pointermove', event => {
        const box = host.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        host.classList.add('is-tilting');
        host.style.transform = `perspective(1400px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      });
      host.addEventListener('pointerleave', () => {
        host.classList.remove('is-tilting');
        host.style.transform = '';
      });
    }
  }

  // The language menu closes on a click outside it or on Escape.
  const menus = [...document.querySelectorAll('details.fl-lang')];
  document.addEventListener('click', event => {
    for (const menu of menus) if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const menu of menus) {
      if (!menu.open) continue;
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();
