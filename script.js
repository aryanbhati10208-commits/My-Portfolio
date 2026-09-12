/**
 * Personal Portfolio - Vanilla JavaScript
 * Handles Navigation, Mobile Menu, Scroll Spy, and Contact Form
 * Zero external libraries, zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Menu Toggle & Navigation Handling
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    // Toggle mobile menu
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('open');
          navMenu.classList.remove('open');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Active Link Scroll Spy (Highlight navbar item based on scroll position)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function handleScrollSpy() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 100; // Offset for sticky navbar

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
  handleScrollSpy(); // Initial check on load

  // -------------------------------------------------------------------------
  // 3. Contact Form Submission (In-place feedback without refreshing)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default page refresh

      // Clear previous error states
      clearErrors();

      // Form validation
      let isValid = true;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (!nameVal) {
        showFieldError(nameInput, 'name-error', 'Please enter your name.');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Message
      if (!messageVal) {
        showFieldError(messageInput, 'message-error', 'Please write a message.');
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Show submitting state on button
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span>`;

        // Simulate seamless submission feedback
        setTimeout(() => {
          // Display clear in-place confirmation message
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>&#10004; Message Sent Successfully!</strong><br>
            Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your message has been received. I will respond to your email at <em>${escapeHtml(emailVal)}</em> soon.
          `;
          formStatus.style.display = 'block';

          // Reset form fields
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Scroll status message into view if on small screens
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Auto-hide success message after 8 seconds
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 8000);
        }, 500);
      }
    });

    // Clear individual field errors on user input
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

  // -------------------------------------------------------------------------
  // Helper Functions
  // -------------------------------------------------------------------------
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
