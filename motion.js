// Drives the landing page scroll story: the step crossing the middle of the screen
// sets the pinned picture's state. Without this script the first state stays shown.
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
})();
