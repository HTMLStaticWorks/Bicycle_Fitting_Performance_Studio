/**
 * VELOMETRIC™ - Main Site Engine
 * Theme Manager, RTL Switcher, Mobile Nav, Form Validation & Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initRtlManager();
  initMobileNav();
  initTabs();
  initAccordions();
  initFormValidation();
  initAuthUI();
  initComparisonSliders();
  initScrollToTop();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Mode Manager (Default: Dark, with Auto-Detection & Persistence)
   -------------------------------------------------------------------------- */
function initThemeManager() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('velometric_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default dark
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcons(initialTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('velometric_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  // Listen to system changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('velometric_theme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
      updateThemeIcons(systemTheme);
    }
  });
}

function updateThemeIcons(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

/* --------------------------------------------------------------------------
   2. RTL Layout Manager (dir="rtl" <-> dir="ltr")
   -------------------------------------------------------------------------- */
function initRtlManager() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('velometric_dir') || 'ltr';

  document.documentElement.setAttribute('dir', storedDir);
  updateRtlLabels(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('velometric_dir', newDir);
      updateRtlLabels(newDir);
    });
  });
}

function updateRtlLabels(dir) {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', `Switch to ${dir === 'rtl' ? 'Left to Right' : 'Right to Left'} layout`);
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navActions = document.querySelector('.nav-actions');

  if (!hamburger || !navMenu) return;

  // Ensure 4 utility actions (Theme, RTL, Login, Dashboard) are placed inside navMenu drawer
  if (!navMenu.querySelector('.nav-drawer-actions') && navActions) {
    const drawerActions = document.createElement('div');
    drawerActions.className = 'nav-drawer-actions';

    const toggles = document.createElement('div');
    toggles.className = 'nav-drawer-toggles';

    const buttons = document.createElement('div');
    buttons.className = 'nav-drawer-buttons';

    const themeBtn = navActions.querySelector('.theme-toggle-btn');
    const rtlBtn = navActions.querySelector('.rtl-toggle-btn');
    const loginBtn = navActions.querySelector('.nav-btn-login');
    const dashBtn = navActions.querySelector('.nav-btn-dashboard');

    if (themeBtn) toggles.appendChild(themeBtn.cloneNode(true));
    if (rtlBtn) toggles.appendChild(rtlBtn.cloneNode(true));
    if (loginBtn) buttons.appendChild(loginBtn.cloneNode(true));
    if (dashBtn) buttons.appendChild(dashBtn.cloneNode(true));

    drawerActions.appendChild(toggles);
    drawerActions.appendChild(buttons);
    navMenu.appendChild(drawerActions);

    // Re-bind click event handlers for theme & rtl toggle buttons
    if (typeof initThemeManager === 'function') initThemeManager();
    if (typeof initRtlManager === 'function') initRtlManager();
  }

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close nav on link click
  navMenu.querySelectorAll('.nav-link, a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside of nav menu and hamburger
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Tab Switcher
   -------------------------------------------------------------------------- */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const btns = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;

        btns.forEach(b => b.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        const activePanel = container.querySelector(`#${target}`);
        if (activePanel) activePanel.classList.add('is-active');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Accordion FAQs
   -------------------------------------------------------------------------- */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close siblings in same group
      const parent = item.closest('.accordion-group');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('is-open');
        });
      }

      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Client-Side Form Validation & Modal Toasts
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.form-error');

        // Check validity
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'This field is required.';
            errorEl.classList.add('is-visible');
          }
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          input.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('is-visible');
          }
        } else {
          input.classList.remove('is-invalid');
          if (errorEl) errorEl.classList.remove('is-visible');
        }

        // Clear error on input
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          if (errorEl) errorEl.classList.remove('is-visible');
        });
      });

      if (isValid) {
        // Show success state toast
        showToast('Success! Your request has been logged in our studio calendar.', 'success');
        form.reset();
      }
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('velometric-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'velometric-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: #14171C;
      color: #FFFFFF;
      border: 1px solid var(--accent-teal);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px var(--accent-teal-glow);
      padding: 16px 24px;
      border-radius: var(--radius-sm);
      z-index: 10000;
      font-weight: 600;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.35s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4500);
}

/* --------------------------------------------------------------------------
   7. Rider Auth State in Navbar
   -------------------------------------------------------------------------- */
function initAuthUI() {
  const isAuth = localStorage.getItem('velometric_auth') === 'true';
  const loginBtn = document.querySelector('.nav-btn-login');

  if (loginBtn) {
    if (isAuth) {
      loginBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>M. Cavendish</span>
      `;
      loginBtn.href = 'dashboard.html';
    } else {
      loginBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        <span>Login</span>
      `;
      loginBtn.href = 'login.html';
    }
  }
}

/* --------------------------------------------------------------------------
   8. Interactive Metric Comparison Sliders
   -------------------------------------------------------------------------- */
function initComparisonSliders() {
  const slider = document.getElementById('metric-range-slider');
  if (!slider) return;

  const kneeAngle = document.getElementById('metric-knee-val');
  const pressureVal = document.getElementById('metric-pressure-val');
  const powerVal = document.getElementById('metric-power-val');

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10); // 0 to 100
    if (kneeAngle) kneeAngle.textContent = `${(32 + (val * 0.08)).toFixed(1)}°`;
    if (pressureVal) pressureVal.textContent = `${(1.8 - (val * 0.009)).toFixed(2)} kg/cm²`;
    if (powerVal) powerVal.textContent = `+${Math.round(val * 0.28)} W`;
  });
}

/* --------------------------------------------------------------------------
   9. Scroll To Top Button Manager
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  let scrollBtn = document.getElementById('scroll-to-top');

  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll back to top');
    scrollBtn.setAttribute('title', 'Scroll back to top');
    scrollBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    document.body.appendChild(scrollBtn);
  }

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('is-visible');
    } else {
      scrollBtn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

