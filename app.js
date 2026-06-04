/* ============================================================
   app.js — Abdulahad Portfolio v2 (Professional Upgrade)
   Author: Abdulahad
   Features: Preloader, cursor glow, navbar spy, reveal
             animations, skill bars, stat counters, project
             filter, contact form, back-to-top, smooth scroll.
   ============================================================ */

$(function () {

  /* ──────────────────────────────────────────
     0. PRELOADER
  ────────────────────────────────────────── */
  $(window).on('load', function () {
    setTimeout(function () {
      $('#preloader').addClass('hidden');
      // After preloader hides, trigger hero animations
      setTimeout(function () {
        $('.hero-section .reveal-up, .hero-section .reveal-right').addClass('in-view');
      }, 200);
    }, 900);
  });

  // Fallback: hide preloader after 3s no matter what
  setTimeout(function () {
    $('#preloader').addClass('hidden');
  }, 3000);


  /* ──────────────────────────────────────────
     1. CURSOR GLOW (desktop pointer only)
  ────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const $glow = $('.cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX  = 0, glowY  = 0;

    $(document).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth lerp follow
    function lerpGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      $glow.css({ left: glowX, top: glowY });
      requestAnimationFrame(lerpGlow);
    }
    lerpGlow();
  } else {
    $('.cursor-glow').hide();
  }


  /* ──────────────────────────────────────────
     2. NAVBAR — scroll class + scroll-spy
  ────────────────────────────────────────── */
  const $nav = $('#mainNav');

  $(window).on('scroll.nav', function () {
    $nav.toggleClass('scrolled', $(this).scrollTop() > 40);
  });

  // Manual scroll-spy
  const $sections = $('section[id]');
  $(window).on('scroll.spy', function () {
    const scrollY = $(this).scrollTop() + 100;
    $sections.each(function () {
      const top    = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id     = $(this).attr('id');
      if (scrollY >= top && scrollY < bottom) {
        $('.navbar-nav .nav-link').removeClass('active');
        $(`.navbar-nav .nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });


  /* ──────────────────────────────────────────
     3. SMOOTH SCROLL — all anchor links
  ────────────────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $(this).attr('href');
    if (!target || target === '#' || !$(target).length) return;
    e.preventDefault();
    const offset = ($nav.outerHeight() || 70) + 12;
    $('html, body').animate(
      { scrollTop: $(target).offset().top - offset },
      650,
      'swing'
    );
    // Close mobile nav if open
    const $navCollapse = $('#navbarNav');
    if ($navCollapse.hasClass('show')) {
      $navCollapse.collapse('hide');
    }
  });


  /* ──────────────────────────────────────────
     4. REVEAL ANIMATIONS — IntersectionObserver
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }


  /* ──────────────────────────────────────────
     5. SKILL BARS — animate width on scroll
  ────────────────────────────────────────── */
  const skillFills = document.querySelectorAll('.skill-fill');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el    = entry.target;
            const width = el.dataset.width || 0;
            setTimeout(() => {
              el.style.width = width + '%';
            }, 250);
            skillObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillFills.forEach((el) => skillObserver.observe(el));
  } else {
    skillFills.forEach((el) => {
      el.style.width = (el.dataset.width || 0) + '%';
    });
  }


  /* ──────────────────────────────────────────
     6. STATS COUNTER — animate numbers
  ────────────────────────────────────────── */
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;

    const $statsSection = $('#stats');
    if (!$statsSection.length) return;

    const sectionTop = $statsSection.offset().top;
    const windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > sectionTop + 100) {
      countersStarted = true;

      $('.stat-counter').each(function () {
        const $el     = $(this);
        const target  = parseInt($el.data('target'), 10);
        const duration = 1800;
        const steps    = 60;
        const stepTime = duration / steps;
        let current    = 0;

        const timer = setInterval(function () {
          current += target / steps;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          $el.text(Math.floor(current));
        }, stepTime);
      });
    }
  }

  $(window).on('scroll.counters', animateCounters);
  animateCounters(); // check on load if already in view


  /* ──────────────────────────────────────────
     7. PROJECT FILTER — show/hide with fade
  ────────────────────────────────────────── */
  $('#projectFilters').on('click', '.filter-btn', function () {
    const $btn   = $(this);
    const filter = $btn.data('filter');

    $('.filter-btn').removeClass('active');
    $btn.addClass('active');

    $('#projectGrid .project-item').each(function () {
      const category = $(this).data('category');
      if (filter === 'all' || category === filter) {
        $(this)
          .removeClass('hidden')
          .css({ opacity: 0, transform: 'translateY(16px)' })
          .animate({ opacity: 1 }, 350)
          .css('transform', 'translateY(0)');
      } else {
        $(this).addClass('hidden');
      }
    });
  });


  /* ──────────────────────────────────────────
     8. CONTACT FORM — validation + loader
  ────────────────────────────────────────── */
  $('#submitBtn').on('click', function () {
    const name    = $('#contactName').val().trim();
    const email   = $('#contactEmail').val().trim();
    const message = $('#contactMessage').val().trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid     = true;

    // Name
    if (!name) {
      $('#contactName').addClass('is-invalid'); valid = false;
    } else {
      $('#contactName').removeClass('is-invalid');
    }

    // Email
    if (!email || !emailRx.test(email)) {
      $('#contactEmail').addClass('is-invalid'); valid = false;
    } else {
      $('#contactEmail').removeClass('is-invalid');
    }

    // Message
    if (!message) {
      $('#contactMessage').addClass('is-invalid'); valid = false;
    } else {
      $('#contactMessage').removeClass('is-invalid');
    }

    if (!valid) return;

    // Show spinner
    $('#btnText').addClass('d-none');
    $('#btnLoader').removeClass('d-none');
    $('#submitBtn').prop('disabled', true);

    // Simulate async send (replace with real fetch/AJAX later)
    setTimeout(function () {
      $('#contactForm').fadeOut(300, function () {
        $('#formSuccess').removeClass('d-none').hide().fadeIn(400);
      });
    }, 1800);
  });

  // Clear invalid state on input
  $(document).on('input', '.custom-input', function () {
    $(this).removeClass('is-invalid');
  });


  /* ──────────────────────────────────────────
     9. BACK TO TOP
  ────────────────────────────────────────── */
  const $btt = $('#backToTop');

  $(window).on('scroll.btt', function () {
    $btt.toggleClass('visible', $(this).scrollTop() > 450);
  });

  $btt.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 550, 'swing');
  });


  /* ──────────────────────────────────────────
     10. NAVBAR HAMBURGER — icon morph
  ────────────────────────────────────────── */
  $('#navbarNav').on('show.bs.collapse', function () {
    const icons = $('.toggler-icon');
    icons.eq(0).css({ transform: 'rotate(45deg) translate(5px, 5px)' });
    icons.eq(1).css({ opacity: 0, transform: 'scaleX(0)' });
    icons.eq(2).css({ transform: 'rotate(-45deg) translate(5px, -5px)' });
  }).on('hide.bs.collapse', function () {
    const icons = $('.toggler-icon');
    icons.eq(0).css({ transform: '' });
    icons.eq(1).css({ opacity: 1, transform: '' });
    icons.eq(2).css({ transform: '' });
  });


  /* ──────────────────────────────────────────
     11. TECH CARD — tilt micro-interaction
  ────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    $(document).on('mousemove', '.tech-card', function (e) {
      const $card  = $(this);
      const rect   = this.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      $card.css('transform', `perspective(400px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateY(-4px)`);
    }).on('mouseleave', '.tech-card', function () {
      $(this).css('transform', '');
    });
  }


  /* ──────────────────────────────────────────
     12. FOOTER YEAR
  ────────────────────────────────────────── */
  $('#footerYear').text(new Date().getFullYear());


  /* ──────────────────────────────────────────
     13. SERVICE CARD — icon pulse on hover
  ────────────────────────────────────────── */
  $(document).on('mouseenter', '.service-card', function () {
    $(this).find('.service-icon-wrap').addClass('pulse-icon');
  }).on('mouseleave', '.service-card', function () {
    $(this).find('.service-icon-wrap').removeClass('pulse-icon');
  });


  /* ──────────────────────────────────────────
     14. PROJECT CARD — stagger on page load
  ────────────────────────────────────────── */
  $('#projectGrid .project-item').each(function (i) {
    $(this).css('transition-delay', (i * 0.07) + 's');
  });

}); // end document ready