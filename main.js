
document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── BURGER MENU ────────────────────────────────────────────
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealElements = document.querySelectorAll(
    '.service-card, .port-card, .team-card, .value-card, .pricing-card, .process-step, .service-block, .why-item, .job-card, .faq-item'
  );
  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── TESTIMONIAL SLIDER ─────────────────────────────────────
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (track && dots.length) {
    let current = 0;
    const total = dots.length;
    let autoInterval;

    function goTo(index) {
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo((current + 1) % total); }

    autoInterval = setInterval(next, 5000);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(autoInterval);
        goTo(parseInt(dot.dataset.index));
        autoInterval = setInterval(next, 5000);
      });
    });

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        clearInterval(autoInterval);
        goTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
        autoInterval = setInterval(next, 5000);
      }
    });
  }

  // ── FAQ ACCORDION ──────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ── PORTFOLIO FILTER ───────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portCards = document.querySelectorAll('.port-card');
  if (filterBtns.length && portCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          if (match) {
            card.classList.remove('hidden');
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.classList.add('hidden'), 300);
          }
        });
      });
    });
  }

  // ── ANIMATED COUNTERS ──────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const duration = 1800;
          const start = performance.now();
          const easeOut = t => 1 - Math.pow(1 - t, 3);

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(easeOut(progress) * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObserver.observe(el));
  }

  // ── CHAR COUNTER (textarea) ────────────────────────────────
  const messageField = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  if (messageField && charCount) {
    messageField.addEventListener('input', () => {
      const len = messageField.value.length;
      charCount.textContent = `${len} / 500`;
      charCount.style.color = len > 450 ? '#ef4444' : 'var(--muted)';
      if (len > 500) messageField.value = messageField.value.slice(0, 500);
    });
  }

  // ── CONTACT FORM VALIDATION & SUBMIT ──────────────────────
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (form) {
    const fields = {
      firstName: { el: form.querySelector('#firstName'), error: form.querySelector('#firstNameError'), msg: 'Le prénom est requis.' },
      lastName:  { el: form.querySelector('#lastName'),  error: form.querySelector('#lastNameError'),  msg: 'Le nom est requis.' },
      email:     { el: form.querySelector('#email'),     error: form.querySelector('#emailError'),     msg: 'Email invalide.' },
      service:   { el: form.querySelector('#service'),   error: form.querySelector('#serviceError'),   msg: 'Veuillez choisir un service.' },
      message:   { el: form.querySelector('#message'),   error: form.querySelector('#messageError'),   msg: 'Le message est requis (min. 20 caractères).' },
      consent:   { el: form.querySelector('#consent'),   error: form.querySelector('#consentError'),   msg: 'Vous devez accepter pour continuer.' },
    };

    // Live validation
    Object.values(fields).forEach(({ el, error, msg }) => {
      if (!el) return;
      el.addEventListener('blur', () => validate(el, error, msg));
      el.addEventListener('input', () => { el.classList.remove('error'); error.textContent = ''; });
    });

    function validate(el, error, msg) {
      let valid = true;
      if (el.type === 'checkbox') {
        valid = el.checked;
      } else if (el.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      } else if (el.id === 'message') {
        valid = el.value.trim().length >= 20;
      } else {
        valid = el.value.trim() !== '' && el.value !== '';
      }
      el.classList.toggle('error', !valid);
      error.textContent = valid ? '' : msg;
      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.values(fields).forEach(({ el, error, msg }) => {
        if (el && !validate(el, error, msg)) allValid = false;
      });
      if (!allValid) return;

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate async submit
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.add('show');
      }, 1800);
    });
  }

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
