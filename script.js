/**
 * Personal Portfolio - Interactive Visual Experience & System Logic
 * Aryan Bhati | B.Tech CSE (AI/ML)
 * Zero external libraries, high performance, vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Ambient Mouse Spotlight Follower
  // -------------------------------------------------------------------------
  const root = document.documentElement;
  let mouseThrottle = false;

  window.addEventListener('mousemove', (e) => {
    if (!mouseThrottle) {
      mouseThrottle = true;
      requestAnimationFrame(() => {
        root.style.setProperty('--mouse-x', `${e.clientX}px`);
        root.style.setProperty('--mouse-y', `${e.clientY}px`);
        mouseThrottle = false;
      });
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 2. Interactive Neural Network / AI Constellation Canvas
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: null, y: null, maxDist: 140 };

    function initCanvasDimensions() {
      const hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
      createParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1.2;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, ';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse gentle interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.maxDist) {
            const force = (mouse.maxDist - dist) / mouse.maxDist;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}0.8)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function createParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 14000), 55);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.maxDist) {
            const alpha = (1 - dist / mouse.maxDist) * 0.55;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId;
    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animateCanvas);
    }

    // Track mouse within hero
    const heroEl = canvas.parentElement;
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroEl.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    initCanvasDimensions();
    animateCanvas();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initCanvasDimensions, 200);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Stats Counter Animation on Scroll
  // -------------------------------------------------------------------------
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);
            el.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    }, { threshold: 0.35 });

    statsObserver.observe(statsSection);
  }

  // -------------------------------------------------------------------------
  // 4. Skills Filter & Progress Bar Animations
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterBtns.length > 0 && skillCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // Animate skill bars when in view
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  let skillsAnimated = false;

  if (skillsSection && skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillBars.forEach((bar) => {
          const targetWidth = bar.style.getPropertyValue('--target-width') || '80%';
          bar.style.width = targetWidth;
        });
      }
    }, { threshold: 0.2 });

    skillObserver.observe(skillsSection);
  }

  // -------------------------------------------------------------------------
  // 5. 3D Tilt Effect on Project Cards
  // -------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // -------------------------------------------------------------------------
  // 6. Mobile Menu Toggle & Navigation Handling
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('open');
          navMenu.classList.remove('open');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Active Link Scroll Spy (Navbar highlight)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function handleScrollSpy() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 110;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  // -------------------------------------------------------------------------
  // 8. Contact Form Submission (Validation & In-place Feedback)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal) {
        showFieldError(nameInput, 'name-error', 'Please enter your name.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      }

      if (!messageVal) {
        showFieldError(messageInput, 'message-error', 'Please write a message.');
        isValid = false;
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending Message...</span>`;

        setTimeout(() => {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>&#10004; Message Sent Successfully!</strong><br>
            Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your message has been received. I will respond to your email at <em>${escapeHtml(emailVal)}</em> shortly.
          `;
          formStatus.style.display = 'block';

          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 8000);
        }, 500);
      }
    });

    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          const parentGroup = input.closest('.form-group');
          if (parentGroup && parentGroup.classList.contains('has-error')) {
            parentGroup.classList.remove('has-error');
          }
        });
      }
    });
  }

  function showFieldError(inputElement, errorElementId, message) {
    if (!inputElement) return;
    const parentGroup = inputElement.closest('.form-group');
    if (parentGroup) {
      parentGroup.classList.add('has-error');
      const errorSpan = document.getElementById(errorElementId);
      if (errorSpan && message) {
        errorSpan.textContent = message;
      }
    }
  }

  function clearErrors() {
    document.querySelectorAll('.form-group.has-error').forEach((group) => {
      group.classList.remove('has-error');
    });
    if (formStatus) {
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
});
