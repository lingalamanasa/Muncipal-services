/* ==========================================================================
   METROCIVIC - CORE PORTAL INTERACTION LOGIC
   Search filters, tax calculator, grievance tracker, accordions, modals
   ========================================================================== */

// Automatically record last visited non-404 page for reliable 404 Go Back navigation
(function() {
  function recordCurrentPage() {
    try {
      const href = window.location.href;
      if (!href.includes('404')) {
        sessionStorage.setItem('stackly_last_page', href);
        localStorage.setItem('stackly_last_page', href);
      }
    } catch (e) {}
  }
  recordCurrentPage();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordCurrentPage);
  }
  window.addEventListener('pageshow', recordCurrentPage);
  document.addEventListener('click', function(e) {
    const el = e.target.closest('a, button, [onclick], span, div');
    if (!el) return;
    const onclickStr = String(el.getAttribute('onclick') || '');
    const hrefStr = String(el.getAttribute('href') || '');
    if (onclickStr.includes('404') || hrefStr.includes('404')) {
      recordCurrentPage();
    }
  }, true);
})();

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Navbar Scroll Effect */
  const navbar = document.querySelector('.civic-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  /* 2. Spring-Board Mobile Menu Navigation Controller */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const closeDrawer = document.querySelector('.close-drawer-btn');

  // Ensure backdrop element exists
  let mobileBackdrop = document.querySelector('.mobile-drawer-backdrop');
  if (!mobileBackdrop) {
    mobileBackdrop = document.createElement('div');
    mobileBackdrop.className = 'mobile-drawer-backdrop';
    document.body.appendChild(mobileBackdrop);
  }

  function openMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    document.body.classList.add('mobile-nav-active');
    mobileBackdrop.classList.add('active');
  }

  function closeMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    document.body.classList.remove('mobile-nav-active');
    mobileBackdrop.classList.remove('active');
  }

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer?.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  closeDrawer?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileNav();
  });

  mobileBackdrop?.addEventListener('click', closeMobileNav);

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Close on navigation click
  mobileDrawer?.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMobileNav, 150);
    });
  });

  /* 3. FAQ Accordion Interaction */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other accordions in the same list
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });

  /* 4. Tab Switcher Logic */
  const tabButtons = document.querySelectorAll('.civic-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const tabContainer = btn.closest('.tabs-parent') || document;

      // Update active button
      tabContainer.querySelectorAll('.civic-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active pane
      tabContainer.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
          // Trigger GSAP stagger on revealed tab cards
          if (typeof gsap !== 'undefined') {
            gsap.from(pane.querySelectorAll('.civic-card, .service-box, .directory-card'), {
              opacity: 0,
              y: 20,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  /* 4b. Auto-switch Tab on Page Load or Hash Change */
  const handleServiceHash = () => {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash.startsWith('#tab-')) {
      const tabName = hash.replace('#', '');
      const tabBtn = document.querySelector(`.civic-tab-btn[data-tab="${tabName}"]`);
      if (tabBtn) {
        tabBtn.click();
        const searchSec = document.getElementById('section-02-catalog') || document.getElementById('section-02-search') || tabBtn;
        if (searchSec) {
          setTimeout(() => {
            searchSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 180);
        }
      }
    } else if (hash.startsWith('#section-')) {
      const targetSec = document.querySelector(hash);
      if (targetSec) {
        setTimeout(() => {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 180);
      }
    }
  };
  handleServiceHash();
  window.addEventListener('hashchange', handleServiceHash);

  /* 5. Modals Management */
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const modalCloses = document.querySelectorAll('.modal-close-btn, .civic-modal-backdrop');
  modalCloses.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        document.querySelectorAll('.civic-modal-backdrop').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
      }
    });
  });

  /* 6. Live Interactive Property Tax Calculator */
  const propAreaInput = document.getElementById('propArea');
  const propTypeSelect = document.getElementById('propType');
  const propWardSelect = document.getElementById('propWard');
  const calcResultEl = document.getElementById('taxTotalDisplay');
  const breakdownBaseEl = document.getElementById('taxBreakdownBase');
  const breakdownSanitationEl = document.getElementById('taxBreakdownSanitation');
  const breakdownLightingEl = document.getElementById('taxBreakdownLighting');

  function calculateMunicipalTax() {
    if (!calcResultEl) return;
    const area = parseFloat(propAreaInput?.value) || 1200;
    const typeRate = parseFloat(propTypeSelect?.value) || 1.8;
    const wardMultiplier = parseFloat(propWardSelect?.value) || 1.2;

    const baseTax = Math.round(area * typeRate * wardMultiplier);
    const sanitationCess = Math.round(baseTax * 0.08);
    const lightingCess = Math.round(baseTax * 0.05);
    const totalTax = baseTax + sanitationCess + lightingCess;

    if (window.animateCountValue) {
      window.animateCountValue(calcResultEl, totalTax, 0.8, '$', '/yr');
    } else {
      calcResultEl.innerText = `$${totalTax.toLocaleString()}/yr`;
    }

    if (breakdownBaseEl) breakdownBaseEl.innerText = `$${baseTax.toLocaleString()}`;
    if (breakdownSanitationEl) breakdownSanitationEl.innerText = `$${sanitationCess.toLocaleString()}`;
    if (breakdownLightingEl) breakdownLightingEl.innerText = `$${lightingCess.toLocaleString()}`;
  }

  propAreaInput?.addEventListener('input', calculateMunicipalTax);
  propTypeSelect?.addEventListener('change', calculateMunicipalTax);
  propWardSelect?.addEventListener('change', calculateMunicipalTax);

  // Run initial calculation
  if (calcResultEl) calculateMunicipalTax();

  /* 7. Citizen Grievance Tracker Lookup Simulator */
  const trackBtn = document.getElementById('trackTicketBtn');
  const ticketInput = document.getElementById('ticketNumberInput');
  const trackingResultBox = document.getElementById('trackingResultContainer');

  trackBtn?.addEventListener('click', () => {
    const query = ticketInput?.value.trim() || 'MUNI-84920';
    if (!trackingResultBox) return;

    // Show loading state
    trackBtn.disabled = true;
    trackBtn.innerHTML = '<span>Searching...</span>';

    setTimeout(() => {
      trackBtn.disabled = false;
      trackBtn.innerHTML = '<span>Track Status</span>';
      trackingResultBox.style.display = 'block';

      // Animate the result appearance
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(trackingResultBox, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.fromTo('.timeline-progress-bar', { width: '0%' }, { width: '68%', duration: 1.2, ease: 'power2.out', delay: 0.2 });
      }

      const displayTicket = document.getElementById('currentSearchedTicket');
      if (displayTicket) displayTicket.innerText = query.toUpperCase();
    }, 600);
  });

  /* 8. Citizen Grievance Submission Form Simulator */
  const grievanceForm = document.getElementById('grievanceForm');
  const formSuccessAlert = document.getElementById('grievanceSuccessBanner');
  const generatedIdSpan = document.getElementById('generatedTicketId');

  grievanceForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const randomTicket = 'MUNI-' + Math.floor(100000 + Math.random() * 900000);

    const submitBtn = grievanceForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Transmitting to Ward Command...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Grievance';
      }
      grievanceForm.reset();
      if (generatedIdSpan) generatedIdSpan.innerText = randomTicket;
      if (formSuccessAlert) {
        formSuccessAlert.style.display = 'block';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(formSuccessAlert, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
        }
      }
    }, 800);
  });

  const grievanceFormFull = document.getElementById('grievanceFormFull');
  const formSuccessAlertFull = document.getElementById('grievanceSuccessBannerFull');
  const generatedIdSpanFull = document.getElementById('generatedTicketIdFull');

  grievanceFormFull?.addEventListener('submit', (e) => {
    e.preventDefault();
    const randomTicket = 'MUNI-' + Math.floor(100000 + Math.random() * 900000);

    const submitBtn = grievanceFormFull.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Transmitting to Ward Command...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-bullhorn"></i> Transmit Grievance to Municipal Control';
      }
      grievanceFormFull.reset();
      if (generatedIdSpanFull) generatedIdSpanFull.innerText = randomTicket;
      if (formSuccessAlertFull) {
        formSuccessAlertFull.style.display = 'block';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(formSuccessAlertFull, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
        }
      }
    }, 800);
  });

  /* 9. Interactive Community Poll Simulator */
  const pollButtons = document.querySelectorAll('.poll-vote-btn');
  let hasVoted = false;

  pollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasVoted) {
        alert('You have already cast your vote for this weekly civic poll.');
        return;
      }
      hasVoted = true;
      const optionRow = btn.closest('.poll-option-row');
      const countSpan = optionRow?.querySelector('.vote-count');
      const barFill = optionRow?.querySelector('.poll-bar-fill');

      if (countSpan) {
        const currentVal = parseInt(countSpan.getAttribute('data-votes') || '120', 10);
        const newVal = currentVal + 1;
        countSpan.innerText = `${newVal} votes`;
        countSpan.setAttribute('data-votes', newVal);
      }

      // Mark selected
      pollButtons.forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.7';
      });
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Voted';
      btn.classList.add('voted');

      const feedback = document.getElementById('pollFeedbackMsg');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerText = 'Thank you! Your civic opinion has been counted in Ward Master Plan #8.';
      }
    });
  });

  /* 10. Ward Councillor Finder Quick Filter */
  const wardSelectFilter = document.getElementById('wardFilterSelect');
  const wardCards = document.querySelectorAll('.councillor-card');

  wardSelectFilter?.addEventListener('change', (e) => {
    const selectedWard = e.target.value;
    wardCards.forEach(card => {
      const cardWard = card.getAttribute('data-ward');
      if (selectedWard === 'all' || cardWard === selectedWard) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    if (typeof gsap !== 'undefined') {
      gsap.from('.councillor-card:not([style*="display: none"])', {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.4
      });
    }
  });

  /* 11. Quick Search Filtering on Services Page */
  const serviceSearchInput = document.getElementById('serviceQuickSearch');
  const searchableServiceCards = document.querySelectorAll('.searchable-service-card');

  serviceSearchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    searchableServiceCards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(term)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  /* 12. 3D Flip Card Interactive Touch / Click Toggle */
  const flipCards = document.querySelectorAll('.flip-card-3d, .station-card-item');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking an action button on back, don't reflip immediately
      if (e.target.closest('button') || e.target.closest('a')) return;
      card.classList.toggle('is-flipped');
    });
  });

  /* 13. Marquee Photostream Play/Pause Controller */
  const marqueeToggleBtn = document.getElementById('marqueeTogglePlay');
  const marqueeTrackWrap = document.querySelector('.marquee-stream-track-wrap');
  marqueeToggleBtn?.addEventListener('click', () => {
    window.location.href = '404error.html';
  });

  /* 14. Bento Grid Category Filter Animation */
  const bentoFilterBtns = document.querySelectorAll('.bento-filter-btn');
  const bentoBoxes = document.querySelectorAll('.bento-box');
  bentoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bentoFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      bentoBoxes.forEach(box => {
        const cat = box.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          box.style.display = 'block';
          box.style.opacity = '0';
          box.style.transform = 'scale(0.95)';
          setTimeout(() => {
            box.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';
          }, 40);
        } else {
          box.style.display = 'none';
        }
      });
    });
  });

  /* 15. Horizontal Service Stations Carousel Buttons */
  const stationsTrack = document.querySelector('.stations-snap-track');
  const scrollLeftBtn = document.getElementById('stationsScrollLeft');
  const scrollRightBtn = document.getElementById('stationsScrollRight');

  scrollLeftBtn?.addEventListener('click', () => {
    stationsTrack?.scrollBy({ left: -360, behavior: 'smooth' });
  });

  scrollRightBtn?.addEventListener('click', () => {
    stationsTrack?.scrollBy({ left: 360, behavior: 'smooth' });
  });

  /* 16. Animated Civic Character Mascot ("Stacky") Controller */
  const stackyMascot = document.getElementById('stackyMascot');
  const stackySpeechText = document.getElementById('stackySpeechText');
  const stackyDynamicLink = document.getElementById('stackyDynamicLink');
  const stageArena = document.getElementById('characterStageArena');
  const topicChips = document.querySelectorAll('.speech-action-chip');

  const btnWave = document.getElementById('btnCharWave');
  const btnDance = document.getElementById('btnCharDance');
  const btnPatrol = document.getElementById('btnCharPatrol');
  const btnSound = document.getElementById('btnCharSound');

  const dialogues = {
    welcome: {
      text: `"<i class=\"fa-solid fa-hand-wave\" style=\"color: var(--brand-orange);\"></i> Hello Citizen! I'm <strong>Stacky</strong>, your 24/7 AI civic companion. How can I assist you with city services today?"`,
      href: 'services.html',
      label: '<i class="fa-solid fa-compass"></i> Explore All Services'
    },
    taxes: {
      text: `"<i class=\"fa-solid fa-house-chimney\" style=\"color: var(--brand-orange);\"></i> Property taxes fund our smart roads, solar lighting, and public libraries! Pay your assessment online in 60 seconds with instant e-Receipt."`,
      href: 'services.html#section-03-calculator',
      label: '<i class="fa-solid fa-receipt"></i> Open Property Tax Portal'
    },
    grievance: {
      text: `"<i class=\"fa-solid fa-screwdriver-wrench\" style=\"color: var(--brand-orange);\"></i> Spotted a civic issue? Log potholes, broken street lights, or water leakages with GPS accuracy. Guaranteed 48-hr officer dispatch!"`,
      href: 'services.html#section-05-stations',
      label: '<i class="fa-solid fa-bullhorn"></i> File Citizen Grievance'
    },
    cityhall: {
      text: `"<i class=\"fa-solid fa-building-columns\" style=\"color: var(--brand-orange);\"></i> Stackly Civic HQ is located at <strong>MMR Complex, Periyakollappatty, Salem, TN 636008</strong> (4.7 Rating). 24/7 Helpline: 1916 (Toll-Free)!"`,
      href: 'contact.html#section-10-stackly-map',
      label: '<i class="fa-solid fa-location-dot"></i> View Salem HQ on Map'
    },
    green: {
      text: `"<i class=\"fa-solid fa-leaf\" style=\"color: var(--brand-orange);\"></i> Did you know? Our electric transit corridors and 400-hectare Green Ridge canopy have offset over 4,200 metric tons of CO2 this year alone!"`,
      href: 'projects.html',
      label: '<i class="fa-solid fa-leaf"></i> Inspect Green Projects'
    }
  };

  const randomFacts = [
    `"<i class=\"fa-solid fa-sparkles\" style=\"color: var(--brand-orange);\"></i> Stackly has processed 99.4% of citizen complaints within 48 hours this quarter!"`,
    `"<i class=\"fa-solid fa-person-biking\" style=\"color: var(--brand-orange);\"></i> Over 6.5 km of scenic, car-free cycling trail is open at Silverwood Riverwalk!"`,
    `"<i class=\"fa-solid fa-solar-panel\" style=\"color: var(--brand-orange);\"></i> 100% of municipal administrative buildings run on rooftop solar micro-grids."`,
    `"<i class=\"fa-solid fa-droplet\" style=\"color: var(--brand-orange);\"></i> Smart SCADA water monitoring has reduced municipal pipeline losses by 28%!"`
  ];

  // Synthesize pleasant futuristic chimes using Web Audio API
  function playCivicChime(freq1 = 587.33, freq2 = 880, type = 'sine') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = type;
      osc2.type = type;
      osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.25);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio not supported or blocked by browser policy
    }
  }

  // Confetti Particle Explosion on click
  function triggerConfetti(x, y) {
    if (!stageArena) return;
    const colors = ['#ff6600', '#ffaa00', '#38bdf8', '#10b981', '#ffffff'];
    const rect = stageArena.getBoundingClientRect();
    const originX = (x || rect.width / 2);
    const originY = (y || rect.height / 2);

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'char-confetti-particle';
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 40 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 20;
      const rot = (Math.random() * 360) + 'deg';
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.backgroundColor = color;
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', rot);

      stageArena.appendChild(p);
      setTimeout(() => p.remove(), 950);
    }
  }

  // Topic Buttons click
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      window.location.href = '404error.html';
    });
  });

  // Mascot Click reaction
  stackyMascot?.addEventListener('click', (e) => {
    // Jump animation
    stackyMascot.classList.remove('stacky-jump');
    void stackyMascot.offsetWidth; // trigger reflow
    stackyMascot.classList.add('stacky-jump');
    setTimeout(() => stackyMascot.classList.remove('stacky-jump'), 750);

    // Confetti & Sound
    const rect = stackyMascot.getBoundingClientRect();
    const arenaRect = stageArena.getBoundingClientRect();
    const cx = (rect.left + rect.width / 2) - arenaRect.left;
    const cy = (rect.top + rect.height / 3) - arenaRect.top;
    triggerConfetti(cx, cy);
    playCivicChime(659.25, 987.77);

    // Random cheerful quote
    if (stackySpeechText) {
      const fact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
      stackySpeechText.style.opacity = '0';
      setTimeout(() => {
        stackySpeechText.innerHTML = fact;
        stackySpeechText.style.opacity = '1';
      }, 150);
    }
  });

  // Animation Controls
  btnWave?.addEventListener('click', () => {
    window.location.href = '404error.html';
  });

  btnDance?.addEventListener('click', () => {
    window.location.href = '404error.html';
  });

  btnPatrol?.addEventListener('click', () => {
    window.location.href = '404error.html';
  });

  btnSound?.addEventListener('click', () => {
    window.location.href = '404error.html';
  });

  /* 17. Tasteful Wobble Card Enter Animation (IntersectionObserver + Stagger) */
  function initWobbleCardEnter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targetSelectors = [
      '.service-box',
      '.pillar-static-card',
      '.flip-card-3d',
      '#section-06-projects .civic-card',
      '.emergency-card',
      '#section-08-notices .civic-card',
      '.counter-box',
      '.topic-card',
      '.directory-card',
      '.project-card',
      '.department-card'
    ];

    const cards = document.querySelectorAll(targetSelectors.join(', '));
    if (!cards.length || !('IntersectionObserver' in window)) return;

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const parent = card.parentElement;
          let idx = 0;
          if (parent) {
            const siblings = Array.from(parent.children).filter(el => {
              return targetSelectors.some(sel => el.matches(sel));
            });
            idx = siblings.indexOf(card);
            if (idx === -1) idx = 0;
          }
          const delayClass = `wobble-delay-${idx % 4}`;
          card.classList.add('wobble-card-enter', delayClass);
          card.classList.remove('wobble-card-ready');
          observer.unobserve(card);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    cards.forEach(card => {
      card.classList.add('wobble-card-ready');
      cardObserver.observe(card);
    });
  }
  initWobbleCardEnter();
});

