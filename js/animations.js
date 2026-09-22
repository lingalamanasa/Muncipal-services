/* ==========================================================================
   STACKLY MUNICIPAL SERVICES - 20+ GSAP & MICRO-INTERACTION ANIMATION SUITE
   Aesthetics: Clean White Background, Black Text, Orange Accents & Buttons
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is available
  const hasGsap = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

  if (hasGsap && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* --------------------------------------------------------------------------
     1. STICKY SCROLL PROGRESS BAR (Scroll Animation)
     -------------------------------------------------------------------------- */
  let progressBar = document.querySelector('.scroll-progress-line');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-line';
    document.body.prepend(progressBar);
  }

  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* Sticky Header Shadow on Scroll */
  const headerNav = document.querySelector('.civic-navbar');
  if (headerNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        headerNav.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
        headerNav.style.borderBottomColor = 'var(--brand-orange)';
      } else {
        headerNav.style.boxShadow = 'none';
        headerNav.style.borderBottomColor = 'var(--border-subtle)';
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     2. TEXT REVEAL / TYPEWRITER EFFECT
     -------------------------------------------------------------------------- */
  const typewriterElements = document.querySelectorAll('.typewriter-text');
  typewriterElements.forEach((el) => {
    const rawWords = el.getAttribute('data-words');
    const words = rawWords ? JSON.parse(rawWords) : [
      "Modern Civic Infrastructure",
      "Instant Citizen Grievance Resolution",
      "Sustainable Green Energy Programs",
      "Smart City Digital Administration"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    const typeLoop = () => {
      const currentWord = words[wordIdx % words.length];
      if (isDeleting) {
        el.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        el.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx++;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, typeSpeed);
    };

    typeLoop();
  });

  /* --------------------------------------------------------------------------
     3. 3D CARD TILT INTERACTION (Card Tilt / 3D Tilt)
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.card-tilt-inner, .hero-visual-card, .tilt-on-hover');
  tiltCards.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.2s ease';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (capped between -12deg and +12deg)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* --------------------------------------------------------------------------
     4. HERO SECTION STAGGER, FADE IN, SLIDE IN & SCALE IN (GSAP)
     -------------------------------------------------------------------------- */
  if (hasGsap) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero tag & Title Fade In / Fade Up
    heroTl
      .from('.hero-badge-tag, .hero-split-left .section-meta', {
        opacity: 0,
        y: -25,
        duration: 0.7,
        delay: 0.1
      })
      .from('.hero-main-title, .hero-split-left h1', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12
      }, '-=0.4')
      .from('.hero-description, .hero-split-left p', {
        opacity: 0,
        y: 25,
        duration: 0.7
      }, '-=0.5')
      .from('.hero-action-row, .hero-split-left .hero-action-row', {
        opacity: 0,
        y: 20,
        duration: 0.7
      }, '-=0.4')
      // Slide In Hero Visual Frame
      .from('.hero-visual-card, .hero-split-right', {
        opacity: 0,
        x: 45,
        scale: 0.95,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.6')
      // Scale In Floating Stat Badges with Elastic bounce
      .from('.hero-stat-floating-tag, .floating-stat-pill', {
        opacity: 0,
        scale: 0.7,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.5');
  }

  /* --------------------------------------------------------------------------
     5. FLOATING OSCILLATION ANIMATION (Continuous Gentle Sine Float)
     -------------------------------------------------------------------------- */
  if (hasGsap) {
    gsap.utils.toArray('.hero-stat-floating-tag, .floating-stat-pill, .anim-floating').forEach((el, index) => {
      const distance = index % 2 === 0 ? 12 : -14;
      const duration = 3.5 + (index * 0.6);

      gsap.to(el, {
        y: `+=${distance}`,
        rotation: index % 2 === 0 ? 1.2 : -1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: duration
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. PARALLAX SCROLLING (GSAP ScrollTrigger Scrub)
     -------------------------------------------------------------------------- */
  if (hasGsap && hasScrollTrigger) {
    gsap.utils.toArray('.parallax-layer, .hero-stat-floating-tag').forEach((item, i) => {
      const speed = (i + 1) * 35;
      gsap.to(item, {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: item.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. SCROLL REVEAL (Section Headers & Smooth Transitions)
     -------------------------------------------------------------------------- */
  if (hasGsap && hasScrollTrigger) {
    gsap.utils.toArray('.section-wrapper').forEach((sec) => {
      const header = sec.querySelector('.section-header');
      if (header) {
        gsap.from(header, {
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 40,
          duration: 0.85,
          ease: 'power3.out'
        });
      }
    });

    // Image Reveal Wipe Effect
    gsap.utils.toArray('.image-reveal-frame').forEach((frame) => {
      const img = frame.querySelector('img');
      gsap.from(frame, {
        scrollTrigger: {
          trigger: frame,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        ease: 'power2.out'
      });

      if (img) {
        gsap.from(img, {
          scrollTrigger: {
            trigger: frame,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          scale: 1.15,
          duration: 1.2,
          ease: 'power2.out'
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. STAGGERED CARDS GRID ANIMATION
     -------------------------------------------------------------------------- */
  if (hasGsap && hasScrollTrigger) {
    const gridSelectors = [
      '.services-grid-8 .service-box',
      '.cards-grid-4 .counter-box',
      '.cards-grid-3 .civic-card',
      '.project-showcase-grid .civic-card',
      '.directory-grid .civic-card',
      '.notice-cards .civic-card',
      '.emergency-cards-grid .emergency-card',
      '.blog-grid-3 .civic-card'
    ];

    gridSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const parent = elements[0].closest('.civic-container') || elements[0].parentElement;
        gsap.from(elements, {
          scrollTrigger: {
            trigger: parent,
            start: 'top 86%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 35,
          stagger: 0.09,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     8b. GSAP CLIP-PATH IMAGE REVEAL ANIMATION (Core Citizen Services Section)
     -------------------------------------------------------------------------- */
  const clipRevealWraps = document.querySelectorAll('.clip-reveal-wrap, .services-grid-8 .civic-card-img-wrap');
  
  if (clipRevealWraps.length > 0) {
    if (hasGsap && hasScrollTrigger) {
      clipRevealWraps.forEach((wrap, index) => {
        const curtain = wrap.querySelector('.clip-reveal-curtain');
        const img = wrap.querySelector('img');
        const card = wrap.closest('.service-box') || wrap;
        const colIndex = index % 4; // Stagger across columns

        // Timeline for curtain clip-path wipe & image zoom reveal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          delay: 0.12 + colIndex * 0.1
        });

        if (curtain && img) {
          // 1. Curtain wipes across from left: polygon(0 0, 0 0, 0 100%, 0 100%) -> polygon(0 0, 100% 0, 100% 100%, 0 100%)
          // 2. Image reveals behind it: clip-path polygon(0 0, 100% 0, 100% 100%, 0 100%) with zoom scale 1.32 -> 1.0
          // 3. Curtain wipes out to the right: polygon(100% 0, 100% 0, 100% 100%, 100% 100%)
          tl.fromTo(curtain, 
            { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.42, ease: 'power3.inOut' }
          )
          .fromTo(img,
            { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', scale: 1.32, filter: 'contrast(112%) brightness(85%)' },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1.0, filter: 'contrast(100%) brightness(100%)', duration: 0.75, ease: 'power3.out' },
            '-=0.18'
          )
          .to(curtain,
            { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', duration: 0.38, ease: 'power3.inOut' },
            '-=0.42'
          );
        } else if (img) {
          tl.fromTo(img,
            { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', scale: 1.35 },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1.0, duration: 0.95, ease: 'power3.out' }
          );
        }
      });
    } else {
      // Fallback if GSAP is not loaded
      clipRevealWraps.forEach(wrap => {
        const curtain = wrap.querySelector('.clip-reveal-curtain');
        const img = wrap.querySelector('img');
        if (curtain) curtain.style.display = 'none';
        if (img) img.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. STAT COUNTER ANIMATION (Count-Up)
     -------------------------------------------------------------------------- */
  if (hasGsap && hasScrollTrigger) {
    const counterElements = document.querySelectorAll('.counter-value[data-target]');
    counterElements.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          let displayVal = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toLocaleString();
          counter.innerHTML = `${prefix}${displayVal}<span>${suffix}</span>`;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. PROGRESS BARS FILL ON SCROLL
     -------------------------------------------------------------------------- */
  if (hasGsap && hasScrollTrigger) {
    const progressBars = document.querySelectorAll('.progress-fill[data-percent]');
    progressBars.forEach((bar) => {
      const percent = bar.getAttribute('data-percent') || '50';
      gsap.to(bar, {
        scrollTrigger: {
          trigger: bar,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        width: `${percent}%`,
        duration: 1.6,
        ease: 'power3.out'
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. SPRING / SPRINGBOARD BUTTON INTERACTIONS
     -------------------------------------------------------------------------- */
  const springButtons = document.querySelectorAll('.btn-portal-action, .btn-portal-secondary, .btn-emergency, .anim-spring');
  springButtons.forEach((btn) => {
    btn.addEventListener('mousedown', () => {
      if (hasGsap) {
        gsap.to(btn, { scale: 0.94, duration: 0.1, ease: 'power1.inOut' });
      } else {
        btn.style.transform = 'scale(0.94)';
      }
    });

    const resetSpring = () => {
      if (hasGsap) {
        gsap.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });
      } else {
        btn.style.transform = 'scale(1)';
      }
    };
    btn.addEventListener('mouseup', resetSpring);
    btn.addEventListener('mouseleave', resetSpring);
  });

  /* --------------------------------------------------------------------------
     12. ACCORDION / EXPAND-COLLAPSE (Civic FAQ & Resolutions)
     -------------------------------------------------------------------------- */
  const accordionHeaders = document.querySelectorAll('.accordion-toggle, .faq-item-header');
  accordionHeaders.forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.accordion-icon, i.fa-chevron-down');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Toggle state
      btn.setAttribute('aria-expanded', !isExpanded);

      if (content) {
        if (!isExpanded) {
          content.style.display = 'block';
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          content.style.paddingTop = '12px';
          content.style.paddingBottom = '12px';
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
          setTimeout(() => { content.style.display = 'none'; }, 300);
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     13. WOBBLE ANIMATION ON HOVER
     -------------------------------------------------------------------------- */
  const wobbleElements = document.querySelectorAll('.anim-wobble, .brand-logo-img');
  wobbleElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (hasGsap) {
        gsap.timeline()
          .to(el, { x: -6, rotation: -2, duration: 0.08 })
          .to(el, { x: 5, rotation: 2, duration: 0.08 })
          .to(el, { x: -4, rotation: -1, duration: 0.08 })
          .to(el, { x: 3, rotation: 1, duration: 0.08 })
          .to(el, { x: 0, rotation: 0, duration: 0.1 });
      }
    });
  });

  /* --------------------------------------------------------------------------
     14. ROTATE ANIMATION TRIGGER
     -------------------------------------------------------------------------- */
  const rotateElements = document.querySelectorAll('.anim-rotate-hover, .rotate-icon');
  rotateElements.forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      if (hasGsap) {
        gsap.to(icon, { rotation: '+=360', duration: 0.6, ease: 'power2.out' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     15. SMOOTH ANCHOR SECTION TRANSITIONS
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     16. HERO BACKGROUND ANIMATING SLIDE IMAGES (Auto-cycling Slides)
     -------------------------------------------------------------------------- */
  const heroSliders = document.querySelectorAll('.hero-animated-bg-wrap');
  heroSliders.forEach((slider) => {
    const slides = slider.querySelectorAll('.hero-bg-slide-item');
    const parentSection = slider.closest('.section-wrapper') || slider.parentElement;
    const dots = parentSection ? parentSection.querySelectorAll('.hero-slide-dot') : [];

    if (slides.length <= 1) return;

    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    // Auto-advance slides every 4 seconds with smooth slide-fade
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 4000);
  });

  /* --------------------------------------------------------------------------
     17. UNIQUE JS EFFECT: CURSOR-FOLLOWING CARD SPOTLIGHT GLOW
     -------------------------------------------------------------------------- */
  const spotlightTargets = document.querySelectorAll(
    '.civic-card, .service-box, .dash-metric-card, .dash-panel, .bento-box, .mini-visual-card, .flip-card-front, .station-front, .counter-box'
  );
  spotlightTargets.forEach((card) => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
     18. UNIQUE JS EFFECT: FLUID CLICK WAVE RIPPLE
     -------------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn-portal-action, .btn-emergency, .btn-portal-switch, .filter-pill-tab, .civic-tab-btn, .bento-filter-btn');
    if (!target) return;

    target.classList.add('civic-ripple-host');
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'civic-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  /* --------------------------------------------------------------------------
     19. UNIQUE JS EFFECT: CIRCULAR SCROLL-TO-TOP WITH DYNAMIC SVG RING
     -------------------------------------------------------------------------- */
  let scrollWidget = document.getElementById('scrollTopWidget');
  if (!scrollWidget) {
    scrollWidget = document.createElement('div');
    scrollWidget.id = 'scrollTopWidget';
    scrollWidget.className = 'scroll-top-circular';
    scrollWidget.setAttribute('title', 'Return to Top');
    scrollWidget.setAttribute('aria-label', 'Scroll to top');
    scrollWidget.innerHTML = `
      <svg viewBox="0 0 50 50">
        <circle class="progress-bg" cx="25" cy="25" r="23"></circle>
        <circle class="progress-bar" id="scrollProgressRing" cx="25" cy="25" r="23"></circle>
      </svg>
      <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(scrollWidget);
  }

  const ringBar = document.getElementById('scrollProgressRing');
  const circumference = 2 * Math.PI * 23; // ~144.5
  if (ringBar) {
    ringBar.style.strokeDasharray = `${circumference}`;
    ringBar.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (ringBar) {
      ringBar.style.strokeDashoffset = `${circumference - (scrollPercent * circumference)}`;
    }

    if (scrollTop > 180) {
      scrollWidget.classList.add('visible');
    } else {
      scrollWidget.classList.remove('visible');
    }
  }, { passive: true });

  scrollWidget.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     20. UNIQUE JS EFFECT: SPOTLIGHT COMMAND BAR (Ctrl+K or Cmd+K)
     -------------------------------------------------------------------------- */
  let spotlightBackdrop = document.getElementById('civicSpotlightModal');
  if (!spotlightBackdrop) {
    spotlightBackdrop = document.createElement('div');
    spotlightBackdrop.id = 'civicSpotlightModal';
    spotlightBackdrop.className = 'civic-spotlight-backdrop';
    spotlightBackdrop.innerHTML = `
      <div class="civic-spotlight-modal" role="dialog" aria-modal="true">
        <div class="spotlight-input-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="spotlightSearchInput" placeholder="Quick Search (e.g. Tax, Grievance, Dashboard, Map)..." autocomplete="off">
          <span class="kbd-badge">ESC</span>
        </div>
        <div class="spotlight-results" id="spotlightResultsList"></div>
        <div class="spotlight-footer">
          <span><i class="fa-solid fa-arrow-turn-down" style="transform: rotate(90deg);"></i> Navigate with <i class="fa-solid fa-arrow-up"></i> <i class="fa-solid fa-arrow-down"></i> &bull; Enter to select</span>
          <span><strong>Stackly Smart Navigator</strong></span>
        </div>
      </div>
    `;
    document.body.appendChild(spotlightBackdrop);
  }

  const spotlightIndex = [
    { title: 'Citizen Civic Dashboard', desc: 'View taxes, track active grievances, and access digital vault', url: 'citizen-dashboard.html', icon: 'fa-house-user', category: 'Portal' },
    { title: 'Staff & Officer Command Hub', desc: 'Administrative dispatch, field crews, and GIS telemetry', url: 'staff-dashboard.html', icon: 'fa-user-shield', category: 'Officer' },
    { title: 'Online Property Tax Assessment', desc: 'Instant municipal rebate calculator and digital payment', url: 'services.html#section-03-tax', icon: 'fa-calculator', category: 'Finance' },
    { title: 'Spot an Issue? 60-Second Grievance Log', desc: 'Report potholes, broken streetlights, or waste overflow', url: 'services.html#section-05-grievance', icon: 'fa-triangle-exclamation', category: 'Services' },
    { title: 'Express Service Kiosks & Stations', desc: 'Find physical municipal service centers with wait times', url: 'services.html#section-05-grievance', icon: 'fa-desktop', category: 'Services' },
    { title: 'Ongoing Infrastructure Projects', desc: 'Solar microgrids, metro transit line, and park expansions', url: 'projects.html', icon: 'fa-city', category: 'Projects' },
    { title: 'City Council & Municipal History', desc: 'Leadership directory, 1888 heritage, and bylaws', url: 'about.html', icon: 'fa-landmark', category: 'About' },
    { title: 'Civic News & Gazette Announcements', desc: 'Recent municipal updates, budget reports, and alerts', url: 'blog.html', icon: 'fa-newspaper', category: 'News' },
    { title: '24/7 Emergency Dispatch Helpline', desc: 'Ambulance, fire, police, and rapid civil defense units', url: 'contact.html', icon: 'fa-phone-volume', category: 'Emergency' },
    { title: 'Sign In to Portal (Citizen / Staff)', desc: 'Secure authentication gateway for residents and officers', url: 'login.html', icon: 'fa-arrow-right-to-bracket', category: 'Auth' },
    { title: 'Register New Citizen Account', desc: 'Instant verified account for digital municipal services', url: 'signup.html', icon: 'fa-user-plus', category: 'Auth' }
  ];

  const spotlightInput = document.getElementById('spotlightSearchInput');
  const spotlightResults = document.getElementById('spotlightResultsList');
  let currentSelectionIndex = 0;

  function renderSpotlightItems(query = '') {
    if (!spotlightResults) return;
    const q = query.toLowerCase().trim();
    const filtered = spotlightIndex.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      spotlightResults.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          <i class="fa-regular fa-folder-open" style="font-size: 2rem; color: var(--border-medium); margin-bottom: 8px; display: block;"></i>
          No matching services found for "<strong>${query}</strong>". Try searching for <em>Tax</em>, <em>Grievance</em>, or <em>Dashboard</em>.
        </div>
      `;
      return;
    }

    spotlightResults.innerHTML = filtered.map((item, idx) => `
      <div class="spotlight-item ${idx === 0 ? 'selected' : ''}" data-url="${item.url}" data-idx="${idx}">
        <div class="spotlight-item-left">
          <i class="fa-solid ${item.icon}" style="color: var(--brand-orange);"></i>
          <div>
            <div style="color: #0a0a0a; font-weight: 700;">${item.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${item.desc}</div>
          </div>
        </div>
        <span class="spotlight-item-badge">${item.category}</span>
      </div>
    `).join('');

    currentSelectionIndex = 0;

    // Attach click triggers
    spotlightResults.querySelectorAll('.spotlight-item').forEach(el => {
      el.addEventListener('click', () => {
        const url = el.getAttribute('data-url');
        if (url) window.location.href = url;
      });
    });
  }

  function openSpotlight() {
    spotlightBackdrop?.classList.add('open');
    renderSpotlightItems('');
    setTimeout(() => spotlightInput?.focus(), 80);
  }

  function closeSpotlight() {
    spotlightBackdrop?.classList.remove('open');
    if (spotlightInput) spotlightInput.value = '';
  }

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (spotlightBackdrop?.classList.contains('open')) {
        closeSpotlight();
      } else {
        openSpotlight();
      }
    } else if (e.key === 'Escape' && spotlightBackdrop?.classList.contains('open')) {
      closeSpotlight();
    } else if (spotlightBackdrop?.classList.contains('open')) {
      const items = spotlightResults?.querySelectorAll('.spotlight-item') || [];
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[currentSelectionIndex]?.classList.remove('selected');
        currentSelectionIndex = (currentSelectionIndex + 1) % items.length;
        items[currentSelectionIndex]?.classList.add('selected');
        items[currentSelectionIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[currentSelectionIndex]?.classList.remove('selected');
        currentSelectionIndex = (currentSelectionIndex - 1 + items.length) % items.length;
        items[currentSelectionIndex]?.classList.add('selected');
        items[currentSelectionIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = items[currentSelectionIndex];
        const url = activeItem?.getAttribute('data-url');
        if (url) window.location.href = url;
      }
    }
  });

  spotlightInput?.addEventListener('input', (e) => {
    renderSpotlightItems(e.target.value);
  });

  spotlightBackdrop?.addEventListener('click', (e) => {
    if (e.target === spotlightBackdrop) closeSpotlight();
  });

  /* --------------------------------------------------------------------------
     21. UNIQUE JS EFFECT: MAGNETIC BUTTON ATTRACTION PHYSICS
     -------------------------------------------------------------------------- */
  const magneticButtons = document.querySelectorAll('.btn-magnetic, .btn-portal-action, .navbar-search-shortcut');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (hasGsap) {
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.25,
          ease: 'power2.out'
        });
      } else {
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (hasGsap) {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.2, 0.4)'
        });
      } else {
        btn.style.transform = 'translate(0px, 0px)';
      }
    });
  });

  /* --------------------------------------------------------------------------
     22. UNIQUE JS EFFECT: LIVE CIVIC CLOCK & TELEMETRY HUD
     -------------------------------------------------------------------------- */
  const tickerTrack = document.querySelector('.ticker-content-track, .ticker-content');
  if (tickerTrack && !document.getElementById('liveCivicClock')) {
    const clockItem = document.createElement('div');
    clockItem.id = 'liveCivicClock';
    clockItem.className = 'ticker-item';
    clockItem.innerHTML = `<span class="ticker-badge outline"><i class="fa-regular fa-clock" style="color: var(--brand-orange);"></i> <span id="civicClockVal">--:--:--</span></span><span>Municipal Civic Time (Synced)</span>`;
    tickerTrack.prepend(clockItem);

    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
      const clockEl = document.getElementById('civicClockVal');
      if (clockEl) clockEl.textContent = `${timeStr}`;
    };
    setInterval(updateClock, 1000);
    updateClock();
  } else if (!document.getElementById('liveCivicClock')) {
    const heroTag = document.querySelector('.hero-badge-tag');
    if (heroTag) {
      const clockBadge = document.createElement('span');
      clockBadge.id = 'liveCivicClock';
      clockBadge.className = 'ticker-badge outline';
      clockBadge.style.marginRight = '8px';
      clockBadge.style.whiteSpace = 'nowrap';
      clockBadge.innerHTML = `<i class="fa-regular fa-clock" style="color: var(--brand-orange);"></i> <span id="civicClockVal">--:--:--</span>`;
      heroTag.prepend(clockBadge);

      const updateClock = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
        const clockEl = document.getElementById('civicClockVal');
        if (clockEl) clockEl.textContent = `${timeStr} Civic Time`;
      };
      setInterval(updateClock, 1000);
      updateClock();
    }
  }

  /* --------------------------------------------------------------------------
     22. TOAST FEEDBACK & INTERACTIVE NOTIFICATIONS (NO 404 HIJACKING)
     -------------------------------------------------------------------------- */
  window.showCivicToast = function(message, icon = 'fa-circle-check', duration = 3000) {
    let toast = document.getElementById('civicToastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'civicToastNotification';
      toast.style.cssText = 'position: fixed; bottom: 28px; right: 28px; z-index: 99999; background: #0f172a; color: #ffffff; padding: 14px 22px; border-radius: 12px; font-weight: 600; font-size: 0.92rem; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid rgba(255,102,0,0.4); opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--brand-orange); font-size: 1.1rem;"></i> <span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.pointerEvents = 'auto';

    clearTimeout(window._civicToastTimer);
    window._civicToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.pointerEvents = 'none';
    }, duration);
  };

  // Flip card hint pill click listener
  document.querySelectorAll('.flip-hint-pill').forEach(pill => {
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = pill.closest('.flip-card-3d, .station-card-item');
      if (card) {
        card.classList.toggle('is-flipped');
      }
    });
  });
});


/* Helper function to trigger interactive counter updates from logic scripts */
window.animateCountValue = function(element, targetValue, duration = 1.2, prefix = '$', suffix = '') {
  if (!element || typeof gsap === 'undefined') return;
  const obj = { val: parseFloat(element.innerText.replace(/[^0-9.-]+/g, '')) || 0 };
  gsap.to(obj, {
    val: targetValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.innerText = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
    }
  });
};
