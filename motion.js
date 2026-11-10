// Drives the landing page scroll story: the step crossing the middle of the screen
// sets the pinned picture's state. Without this script the first state stays shown.
// Also closes the language menu the way a menu should.
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
