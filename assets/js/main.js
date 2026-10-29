(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Abertura
  const loaded = () => document.body.classList.add('is-loaded');
  if (reduced) loaded();
  else window.addEventListener('load', () => setTimeout(loaded, 1300));
  setTimeout(loaded, 3500); // garante a saída mesmo com rede lenta

  // Ano no rodapé
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Navegação: fundo ao rolar + botão flutuante do WhatsApp
  const nav = document.querySelector('[data-nav]');
  const wa = document.querySelector('.wa-float');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    wa.classList.toggle('is-on', y > window.innerHeight * .7);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  // Revelação ao rolar (com leve escalonamento entre irmãos)
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 0.08}s`);
    io.observe(el);
  });

  // Manifesto: palavras acendem conforme a rolagem
  const quote = document.querySelector('[data-split]');
  let words = [];
  if (quote && !reduced) {
    const wrap = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part.trim()) { frag.append(part); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.append(span);
          });
          child.replaceWith(frag);
        } else wrap(child);
      });
    };
    wrap(quote);
    words = [...quote.querySelectorAll('.w')];
  }

  // Luz que segue o cursor nos cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Antes e depois
  document.querySelectorAll('.ba').forEach(ba => {
    const range = ba.querySelector('.ba__range');
    const set = v => ba.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => set(range.value));
    // pequena demonstração quando o card aparece pela primeira vez
    if (reduced) return;
    const demo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      demo.disconnect();
      const start = performance.now();
      const step = now => {
        const t = Math.min((now - start) / 1600, 1);
        const v = 50 + Math.sin(t * Math.PI * 2) * 18 * (1 - t);
        set(v); range.value = v;
        if (t < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    }, { threshold: .6 });
    demo.observe(ba);
  });

  // Rolagem horizontal da experiência + linhas de progresso
  const hs = document.querySelector('[data-hscroll]');
  const track = hs && hs.querySelector('[data-track]');
  const steps = document.querySelector('[data-steps]');
  const desktop = matchMedia('(min-width: 861px)');

  const progressOf = (el, startFactor = 1, endFactor = 0) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * startFactor;
    const total = r.height + start - vh * endFactor;
    return Math.min(Math.max((start - r.top) / total, 0), 1);
  };

  let ticking = false;
  const frame = () => {
    ticking = false;
    if (track && desktop.matches && !reduced) {
      const r = hs.getBoundingClientRect();
      const span = hs.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-r.top / span, 0), 1);
      const max = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-p * max}px,0,0)`;
      hs.style.setProperty('--p', p);
    }
    if (steps) steps.style.setProperty('--p', progressOf(steps, .7, .5).toFixed(3));
    if (words.length) {
      const p = progressOf(quote, .85, .55);
      const lit = Math.round(p * words.length * 1.15);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();

  // Depoimento em vídeo
  const story = document.querySelector('[data-story]');
  const play = document.querySelector('[data-story-play]');
  if (story && play) {
    const phone = story.closest('.phone');
    play.addEventListener('click', () => {
      story.controls = true;
      story.play();
    });
    story.addEventListener('play', () => phone.classList.add('is-playing'));
    story.addEventListener('ended', () => { phone.classList.remove('is-playing'); story.controls = false; story.load(); });
  }

  // Vídeo do hero só roda quando visível (economiza bateria no celular)
  const heroVideo = document.querySelector('.arch__video');
  if (heroVideo) {
    if (reduced) heroVideo.pause();
    else new IntersectionObserver(([e]) => { e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause(); }).observe(heroVideo);
  }
})();
