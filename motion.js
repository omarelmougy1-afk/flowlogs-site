// Drives the landing page scroll story: the step crossing the middle of the screen
// sets the pinned picture's state. Without this script the first state stays shown.
// Also: staggered card reveals, word-by-word headings, screenshots that lean towards the
// pointer, and a language menu that closes the way a menu should. All motion stays off
// when the visitor asks for reduced motion.
(() => {
  for (const story of document.querySelectorAll('.fl-story-live')) {
    const stage = story.querySelector('.fl-stage');
    const steps = [...story.querySelectorAll('.fl-story-step')];
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          stage.dataset.active = entry.target.dataset.step;
          for (const step of steps) step.classList.toggle('is-active', step === entry.target);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const step of steps) observer.observe(step);
  }

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollLinked = window.CSS?.supports?.('animation-timeline: view()');

  if (!calm && scrollLinked) {
    // Cards side by side arrive one after another rather than all at once.
    const parents = new Set([...document.querySelectorAll('[data-reveal]')].map(el => el.parentElement));
    for (const parent of parents) {
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
        span.style.setProperty('--w', Math.min(i, 10));
        span.textContent = word;
        heading.append(span, i < words.length - 1 ? ' ' : '');
      });
      heading.classList.add('fl-words');
    }
  }

  // Screenshots lean a few degrees towards the mouse pointer.
  if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const shots = document.querySelectorAll('img[src*="team-timesheet"], img[src*="flow-report"], img[src*="pdf-report"]');
    for (const img of shots) {
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
