/**
 * =============================================================================
 * MUHAMMAD ARYAN AFZAL — PORTFOLIO CORE SCRIPTS
 * Vanilla JavaScript (ES6+) — Zero External Framework Bloat
 * Features: Dark/Light Mode, Interactive Terminal, Working Contact Form,
 * Dynamic Typing, Project Filtering & Deep Dive Modal, Image Lightbox
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDynamicTyping();
  initMobileNavigation();
  initScrollSpy();
  initStatsCounter();
  initProjectFiltersAndSearch();
  initInteractiveTerminal();
  initWorkingContactForm();
  initBackToTop();
  initCurrentYear();
});

/* =============================================================================
   1. THEME ENGINE (DARK / LIGHT MODE WITH LOCALSTORAGE)
   ============================================================================= */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('aryan-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', activeTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';

      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('aryan-theme', nextTheme);
    });
  }
}

/* =============================================================================
   2. DYNAMIC HERO TYPING EFFECT
   ============================================================================= */
function initDynamicTyping() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Web Design & UI/UX Architecture',
    'Next.js & React Frontend Engineering',
    'AI OCR & TrOCR Deep Learning Models',
    'Enterprise Form Portals at Engro',
    'Full-Stack Systems & Telemetry'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 65;
  const deletingSpeed = 35;
  const pauseEnd = 2000;
  const pauseStart = 500;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}

/* =============================================================================
   3. MOBILE NAVIGATION DRAWER
   ============================================================================= */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* =============================================================================
   4. NAVBAR SCROLL SPY & ELEVATION
   ============================================================================= */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const navContainer = navbar ? navbar.querySelector('.navbar-container') : null;
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links .nav-link, .nav-pill-menu .nav-link');

  window.addEventListener('scroll', () => {
    // Elevate floating pill when scrolled
    if (window.scrollY > 40) {
      if (navContainer) {
        navContainer.style.boxShadow = '0 16px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 210, 255, 0.25)';
      }
    } else {
      if (navContainer) {
        navContainer.style.boxShadow = '';
      }
    }

    // Active link highlighting
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* =============================================================================
   5. ANIMATED STATS COUNTER
   ============================================================================= */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            animateCounter(stat, target, 1600);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.hero-stats-grid');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(element, target, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOutQuad = progress * (2 - progress);
    element.textContent = Math.floor(easeOutQuad * target);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  }

  window.requestAnimationFrame(step);
}

/* =============================================================================
   6. PROJECTS FILTERING & REAL-TIME SEARCH
   ============================================================================= */
function initProjectFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('repo-search');
  const searchClear = document.getElementById('search-clear');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('no-results');

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = card.querySelector('.repo-name').textContent.toLowerCase();
      const desc = card.querySelector('.repo-desc').textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            desc.includes(searchTerm) || 
                            tags.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = searchTerm ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      clearRepoSearch();
    });
  }
}

function clearRepoSearch() {
  const searchInput = document.getElementById('repo-search');
  const searchClear = document.getElementById('search-clear');
  if (searchInput) {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  }
  if (searchClear) searchClear.style.display = 'none';
}

/* =============================================================================
   7. INTERACTIVE DEVELOPER TERMINAL (CLI SIMULATOR)
   ============================================================================= */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalBody = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('terminal-clear-btn');

  if (!terminalInput) return;

  const commandList = {
    help: `Available commands:
  • bio           - Background, university, and core philosophy
  • skills        - Categorized tech stack & proficiencies
  • design        - Figma systems, auto-layout & live landing pages
  • mindrift      - Tendem project web design standards alignment
  • repos         - All 13+ GitHub repositories by @AryanAfzal
  • posts         - Highlights from verified LinkedIn milestones
  • experience    - Professional internships (Engro, Codeifyy, ACM)
  • contact       - Email, phone, LinkedIn, and hiring channels
  • sudo hire-me  - Initiate an interview / hiring handshake
  • clear         - Clear the terminal console output`,

    design: `UI / WEB DESIGN & FIGMA CASE STUDIES:
  • ACM CUI Wah Landing Page:
    - Figma Design System: https://www.figma.com/design/HFUTK19uPcBcmiDNkTZJKh/ACM?node-id=0-1&p=f&t=rnG6Y2gA8hSzKoRW-0
    - Live Production URL: https://www.acmcuiwah.com/
    - Architecture: Scalable Figma auto-layout components, typography hierarchy, tokenized design-to-code in React.js & Tailwind CSS.
  • EngroFormsPortal:
    - Enterprise multi-step workflow portal digitizing internal operations at Engro Fertilizers Ltd.
  • AutoGrade AI UX:
    - Information-dense OCR grading interface with confidence scoring and side-by-side answer verification.`,

    mindrift: `MINDRIFT / TENDEM PROJECT ROLE ALIGNMENT (WEB DESIGNER):
  [+] Conversion-Driven Layouts: Structuring pitch-style one-pagers and marketing sites from briefs or text copy.
  [+] Scalable Figma Systems: Deep proficiency in auto-layout, organized frames, component variants & tokens.
  [+] Developer & No-Code Handoff: Preparing exportable assets and implementation-ready specs for React, Webflow, and Framer.
  [+] Cross-Platform Consistency: Maintaining strict visual harmony across web pages, pitch decks, and social media.
  [+] English Proficiency: Upper-intermediate (B2/C1) for remote international collaboration.
  [+] Availability: 10–20 hours/week part-time freelance at up to $50/hr equivalent.`,

    bio: `[NAME]: Muhammad Aryan Afzal
[ROLE]: Web Designer | Frontend Developer | AI/ML Explorer
[EDUCATION]: BS Computer Science, COMSATS University Islamabad (CGPA 3.52/4.00)
[HONORS]: Merit Laptop Scheme Awardee (2023), HRCA Contest Runner-Up (2020)
[LOCATION]: Taxila & Daharki, Pakistan
[SUMMARY]: Translating complex enterprise workflows and Figma designs into responsive, resilient web applications. Experienced at Engro Fertilizers Ltd., Codeifyy Solutions R&D, and ACM CUI Wah.`,

    skills: `TECHNICAL PROFICIENCY MATRIX:
  • UI & Design: Figma, Responsive Layouts, Spacing Systems, Typography, Design-to-Code
  • Frontend:    React.js, Next.js 14, JavaScript (ES6+), TypeScript, HTML5/CSS3, Tailwind CSS
  • AI & ML:     TrOCR (Vision Transformers), PyTorch, OpenCV, Data Preprocessing, Qwen 2.5
  • Backend:     Node.js, NestJS, FastAPI, Supabase, PostgreSQL, MySQL, RESTful APIs
  • Tools:       Git, GitHub, Jira Enterprise, Vercel, VS Code, Linux/Bash`,

    repos: `FEATURED GITHUB REPOSITORIES (github.com/AryanAfzal):
  1. AutoGrade                   -> AI handwritten exam evaluation platform (Next.js/TrOCR/Postgres)
  2. OCR_SYSTEM                  -> Core ML handwritten text recognition using Microsoft TrOCR Base
  3. EngroFromsPortal            -> Enterprise web portal replacing paper forms at Engro Fertilizers Ltd.
  4. EdirectoryFrom              -> Corporate employee eDirectory onboarding and registration system
  5. ACM CUI Web                 -> Official student chapter portal (React.js, Supabase, Tailwind)
  6. olt-gui-dashboard           -> Telecommunications Optical Line Terminal network monitoring UI
  7. LineTracing-App-Flutter-    -> Mobile telemetry & PID controller for autonomous robotics
  8. Tailor-Managment-System     -> Client measurement & order ERP mobile app (Flutter/Dart)
  9. Transport-Management-System -> Java Swing logistics and fleet management desktop software`,

    posts: `VERIFIED LINKEDIN POSTS & MILESTONES (linkedin.com/in/muhammadaryanafzal):
  [1] AutoGrade AI OCR Release:
      Turned handwritten student sheets into digital text using TrOCR & PaddleOCR with 98% accuracy.
  [2] Engro Fertilizers Internship:
      Completed SWE internship at Manufacturing Division Daharki; built EngroFormsPortal & presented on OSI/TCP-IP.
  [3] Codeifyy Solutions Appointment:
      Joined as AI/ML Developer Trainee in R&D working under CTO Muhammad Ahmad.
  [4] Google / Coursera Certifications:
      - The Nuts and Bolts of Machine Learning (95% Score)
      - Introduction to Git & GitHub (HEC Funded)
  [5] CodZar Coding Competition:
      Secured 5th Place on leaderboard at Bahria University Islamabad.`,

    experience: `WORK EXPERIENCE TIMELINE:
  • Jul 2026 – Aug 2026: IT Support & Software Engineering Intern @ Engro Fertilizers Ltd. (Daharki)
  • Jul 2026 – Aug 2026: AI/ML Developer Trainee @ Codeifyy Solutions (Pvt.) Ltd. (R&D)
  • Jun 2025 – Present : Frontend Developer Intern & Executive Member @ ACM CUI Wah Chapter`,

    contact: `DIRECT CONTACT DETAILS:
  • Email:    maryan3604@gmail.com
  • Phone:    +92 366-2372537
  • LinkedIn: https://www.linkedin.com/in/muhammadaryanafzal/recent-activity/all/
  • GitHub:   https://github.com/AryanAfzal
  • WhatsApp: https://wa.me/923662372537`,

    'sudo hire-me': `PERMISSION GRANTED: Handshake initiated!
Muhammad Aryan Afzal is available for:
  [+] Full-Time Frontend Engineering
  [+] UI/UX Design & Figma-to-Code Implementation
  [+] Enterprise Portal & Web Workflow Digitization
  [+] Contract & Remote Freelance

Email maryan3604@gmail.com or scroll down to the Contact form to send an offer!`
  };

  const historyList = [];
  let historyIdx = -1;

  function runCmd(inputStr) {
    const rawCmd = inputStr.trim();
    if (!rawCmd) return;

    historyList.push(rawCmd);
    historyIdx = historyList.length;

    const cmdLower = rawCmd.toLowerCase();

    // Create execution block
    const block = document.createElement('div');
    block.className = 'terminal-output-block';

    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'cmd-line-echo';
    cmdEcho.innerHTML = `<span class="prompt-user">aryan@portfolio</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span> ${escapeHTML(rawCmd)}`;
    block.appendChild(cmdEcho);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'cmd-result';

    if (cmdLower === 'clear') {
      terminalHistory.innerHTML = '';
      terminalInput.value = '';
      return;
    } else if (commandList[cmdLower]) {
      resultDiv.textContent = commandList[cmdLower];
    } else {
      resultDiv.innerHTML = `<span style="color: #ef4444;">zsh: command not found: ${escapeHTML(rawCmd)}</span>. Type <span style="color: #f59e0b;">help</span> to see available commands.`;
    }

    block.appendChild(resultDiv);
    terminalHistory.appendChild(block);

    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCmd(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = historyList[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < historyList.length - 1) {
        historyIdx++;
        terminalInput.value = historyList[historyIdx];
      } else {
        historyIdx = historyList.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalHistory.innerHTML = '';
    });
  }

  window.executeCommand = function(cmd) {
    terminalInput.value = cmd;
    runCmd(cmd);
    terminalInput.focus();
  };
}

/* =============================================================================
   8. WORKING CONTACT FORM (FORMSUBMIT AJAX DIRECT TO maryan3604@gmail.com)
   ============================================================================= */
function initWorkingContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formAlert = document.getElementById('form-alert');
  const toastModal = document.getElementById('toast-modal');

  if (!form || !submitBtn) return;

  const nameInput = document.getElementById('user_name');
  const emailInput = document.getElementById('user_email');
  const subjectInput = document.getElementById('user_subject');
  const messageInput = document.getElementById('user_message');
  const hiddenSubject = document.getElementById('form-subject-hidden');

  function validate() {
    let isValid = true;

    // Reset previous errors
    document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Email with standard regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value) {
      subjectInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    return isValid;
  }

  // Remove error classes dynamically on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Update dynamic hidden subject
    if (hiddenSubject) {
      hiddenSubject.value = `[Portfolio Inquiry] ${subjectInput.value} - from ${nameInput.value.trim()}`;
    }

    // UI Loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;

    if (formAlert) {
      formAlert.style.display = 'none';
      formAlert.className = 'form-alert';
    }

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value,
      message: messageInput.value.trim(),
      _subject: hiddenSubject ? hiddenSubject.value : 'Portfolio Message',
      _captcha: 'false',
      _template: 'table'
    };

    try {
      // Direct FormSubmit AJAX Endpoint (delivers directly to maryan3604@gmail.com)
      const response = await fetch('https://formsubmit.co/ajax/maryan3604@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok || data.success === 'true' || data.success === true) {
        // Form submitted successfully!
        form.reset();
        if (toastModal) {
          toastModal.classList.add('open');
        } else if (formAlert) {
          formAlert.textContent = 'Thank you! Your message has been delivered to maryan3604@gmail.com.';
          formAlert.classList.add('success');
          formAlert.style.display = 'block';
        }
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback activated:', err);
      // Fallback: If network block or CORS occurs, guide the user to the direct email link
      if (formAlert) {
        formAlert.innerHTML = `Unable to complete automatic transmission. Please <a href="mailto:maryan3604@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent(messageInput.value)}" style="text-decoration:underline; font-weight:700;">Click Here to Email Directly</a>.`;
        formAlert.classList.add('error');
        formAlert.style.display = 'block';
      }
    } finally {
      btnText.style.display = 'inline-flex';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

function closeToastModal() {
  const toastModal = document.getElementById('toast-modal');
  if (toastModal) toastModal.classList.remove('open');
}

/* =============================================================================
   9. COPY EMAIL TO CLIPBOARD WITH TOOLTIP
   ============================================================================= */
function copyEmailToClipboard() {
  const email = 'maryan3604@gmail.com';
  const tooltip = document.getElementById('copy-tooltip');

  navigator.clipboard.writeText(email).then(() => {
    if (tooltip) {
      tooltip.textContent = 'Copied!';
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.textContent = 'Copy';
        tooltip.classList.remove('show');
      }, 2200);
    }
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    if (tooltip) {
      tooltip.textContent = 'Copied!';
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.textContent = 'Copy';
        tooltip.classList.remove('show');
      }, 2200);
    }
  });
}

/* =============================================================================
   10. LINKEDIN POST MEDIA SWITCHERS
   ============================================================================= */
function switchEngroImage(src, caption, btn) {
  const img = document.getElementById('engro-gallery-img');
  const captionEl = document.getElementById('gallery-caption-overlay');
  const allThumbs = btn.parentElement.querySelectorAll('.thumb-btn');

  if (img) img.src = src;
  if (captionEl) captionEl.textContent = caption;

  allThumbs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const container = img.closest('.gallery-main');
  if (container) {
    container.setAttribute('onclick', `openLightbox('${src}', '${caption}')`);
  }
}

function switchCodeifyyImage(src, caption, btn) {
  const img = document.getElementById('codeifyy-gallery-img');
  const captionEl = document.getElementById('codeifyy-caption-overlay');
  const allThumbs = btn.parentElement.querySelectorAll('.thumb-btn');

  if (img) img.src = src;
  if (captionEl) captionEl.textContent = caption;

  allThumbs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const container = img.closest('.gallery-main');
  if (container) {
    container.setAttribute('onclick', `openLightbox('${src}', '${caption}')`);
  }
}

function switchCodezarImage(src, caption, btn) {
  const img = document.getElementById('codezar-gallery-img');
  const captionEl = document.getElementById('codezar-caption-overlay');
  const allThumbs = btn.parentElement.querySelectorAll('.thumb-btn');

  if (img) img.src = src;
  if (captionEl) captionEl.textContent = caption;

  allThumbs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const container = img.closest('.gallery-main');
  if (container) {
    container.setAttribute('onclick', `openLightbox('${src}', '${caption}')`);
  }
}

function switchAcmImage(src, caption, btn) {
  const img = document.getElementById('acm-gallery-img');
  const captionEl = document.getElementById('acm-caption-overlay');
  const allThumbs = btn.parentElement.querySelectorAll('.thumb-btn');

  if (img) img.src = src;
  if (captionEl) captionEl.textContent = caption;

  allThumbs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const container = img.closest('.gallery-main');
  if (container) {
    container.setAttribute('onclick', `openLightbox('${src}', '${caption}')`);
  }
}

/* =============================================================================
   11. LIGHTBOX MODAL (IMAGE PREVIEW)
   ============================================================================= */
function openLightbox(src, caption) {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!lightboxModal || !lightboxImg) return;

  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightboxModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event.target.id === 'lightbox-modal') {
    closeLightboxDirectly();
  }
}

function closeLightboxDirectly() {
  const lightboxModal = document.getElementById('lightbox-modal');
  if (lightboxModal) {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* =============================================================================
   12. PROJECT DEEP DIVE MODAL
   ============================================================================= */
const projectDetailsData = {
  autograde: {
    title: 'AutoGrade — AI Handwritten Exam Evaluation Platform',
    badge: 'Flagship AI Product',
    headline: 'Converting student handwritten paper exams into machine-evaluated grades with 98% OCR confidence.',
    image: 'assets/images/posts/autograde-ocr.jpg',
    overview: `AutoGrade is an end-to-end educational technology solution designed to automate the heavy evaluation burden of written academic examinations. The platform takes scanned multi-page handwritten PDFs, isolates individual questions and student handwriting, reconstructs reading flow, and delivers transparent grading feedback based on an instructor rubric.`,
    challenges: [
      'Irregular handwriting styles, cursive variations, and varying paper conditions.',
      'Maintaining exact question segmentation across multi-page answer booklets.',
      'Preventing hallucinations by bounding LLM post-processing to verbatim text repair only.'
    ],
    solutions: [
      'Engineered a hybrid vision pipeline combining OpenCV adaptive thresholding, PaddleOCR for bounding box layout detection, and Microsoft TrOCR Base fine-tuned on handwritten scripts.',
      'Integrated a local Qwen 2.5 LLM via Ollama and SymSpell for typo smoothing while preserving student voice.',
      'Built a reactive Next.js 14 frontend paired with a NestJS backend and PostgreSQL database for question-by-question scoring and confidence graphs.'
    ],
    stack: ['Next.js 14', 'NestJS', 'PyTorch', 'Microsoft TrOCR Base', 'PaddleOCR', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
    repoLink: 'https://github.com/AryanAfzal/AutoGrade'
  },

  'ocr-system': {
    title: 'OCR_SYSTEM — Vision Transformer Microservice',
    badge: 'Machine Learning Core',
    headline: 'High-throughput handwritten text recognition engine powered by PyTorch and Microsoft TrOCR.',
    image: 'assets/images/posts/autograde-ocr.jpg',
    overview: `OCR_SYSTEM is the dedicated computer vision microservice underpinning AutoGrade. Built with Python and FastAPI, it exposes high-speed endpoints for line-level handwriting segmentation and inference across dense academic exam papers.`,
    challenges: [
      'High GPU memory consumption when batch-processing high-resolution answer sheet scans.',
      'Detecting faint or smudged pen strokes without introducing noise artifacts.'
    ],
    solutions: [
      'Implemented Contrast Limited Adaptive Histogram Equalization (CLAHE) and bilateral filtering to normalize contrast.',
      'Chunked image line strips dynamically with automatic batch sizing for efficient inference.',
      'Exposed REST endpoints via FastAPI with structured confidence score matrices.'
    ],
    stack: ['Python 3.11', 'PyTorch', 'Transformers (HuggingFace)', 'OpenCV', 'CLAHE', 'FastAPI'],
    repoLink: 'https://github.com/AryanAfzal/OCR_SYSTEM'
  },

  'engro-portal': {
    title: 'EngroFormsPortal — Enterprise Workflow & Form Portal',
    badge: 'Enterprise Industrial System',
    headline: 'Replacing legacy paper approvals with unified, role-based digital forms at Engro Fertilizers Ltd.',
    image: 'assets/images/posts/engro-presentation.jpg',
    overview: `Built during my engineering internship in the Manufacturing Division at Engro Fertilizers Limited (Daharki). The project consolidated disparate departmental paper forms into a single responsive digital portal, drastically reducing approval latency and eliminating physical routing delays.`,
    challenges: [
      'Diverse non-technical user base requiring an intuitive, error-resistant interface.',
      'Complex multi-tier approval chains involving General Managers, Security guards, and department heads.',
      'Integration into restricted enterprise networks with strict static deployment constraints.'
    ],
    solutions: [
      'Developed a clean, consistent design system with clear visual hierarchies, breadcrumbs, and status pills.',
      'Created modular workflows for Employee eDirectory Registration and Material Gate Pass requisitions with role-specific views.',
      'Packaged the portal as an asset-optimized static web distribution ready for seamless intranet deployment.'
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Enterprise UX', 'Form Validation', 'Jira'],
    repoLink: 'https://github.com/AryanAfzal/EngroFromsPortal'
  },

  'acm-portal': {
    title: 'ACM CUI Wah Portal — Official Student Chapter Platform',
    badge: 'Community Web Platform',
    headline: 'Empowering 100+ students with event registration, executive rosters, and hackathon leaderboards.',
    image: 'assets/images/posts/acm-frontend-cert.jpg',
    overview: `As a Frontend Developer Intern and Executive Member of the Code Hub at ACM CUI Wah, I built and maintained components for the chapter's official web presence. The platform serves as the central hub for technical bootcamps, programming contest announcements, and member engagement.`,
    challenges: [
      'Frequent content updates requiring a database-driven architecture without complex backend overhead.',
      'Ensuring responsive performance across varying student mobile devices during live event signups.'
    ],
    solutions: [
      'Implemented component-driven architecture using React.js and Tailwind CSS.',
      'Integrated Supabase for real-time announcements and event registration storage.',
      'Collaborated within an Agile/Git workflow with team code reviews and deployment cycles.'
    ],
    stack: ['React.js', 'Figma Auto-Layout', 'Design Systems', 'Supabase', 'Tailwind CSS', 'Git/GitHub'],
    repoLink: 'https://github.com/ACM-CUI-Wah/ACM-CUI-Web',
    figmaLink: 'https://www.figma.com/design/HFUTK19uPcBcmiDNkTZJKh/ACM?node-id=0-1&p=f&t=rnG6Y2gA8hSzKoRW-0',
    liveLink: 'https://www.acmcuiwah.com/'
  },

  'olt-dashboard': {
    title: 'OLT GUI Dashboard — Telecom Network Telemetry',
    badge: 'Infrastructure & Hardware UI',
    headline: 'Real-time PON port monitoring, optical attenuation graphs, and ONU status management.',
    image: 'assets/images/posts/tms-java-gui.jpg',
    overview: `An intuitive management dashboard built in TypeScript for telecommunications engineers to monitor Optical Line Terminals (OLT). Provides real-time visibility into optical fiber signal health, power levels, and hardware state across multiple PON interfaces.`,
    challenges: [
      'Visualizing high-frequency telemetry streams without causing DOM re-render lag.',
      'Providing quick alert recognition for sudden fiber degradation or signal drops.'
    ],
    solutions: [
      'Structured modular TypeScript components with optimized rendering intervals.',
      'Implemented clean status color indicators and hardware topology widgets.',
      'Built interactive filtering by slot, port, and subscriber ONU ID.'
    ],
    stack: ['TypeScript', 'React', 'Data Visualization', 'Telecom Telemetry', 'Tailwind'],
    repoLink: 'https://github.com/AryanAfzal/olt-gui-dashboard'
  }
};

function openProjectModal(projectId) {
  const data = projectDetailsData[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const figmaBtn = data.figmaLink ? `
    <a href="${data.figmaLink}" target="_blank" rel="noopener noreferrer" class="btn btn-figma btn-md">
      <i class="fa-brands fa-figma"></i> Open Figma Design
    </a>
  ` : '';

  const liveBtn = data.liveLink ? `
    <a href="${data.liveLink}" target="_blank" rel="noopener noreferrer" class="btn btn-live btn-md">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Website
    </a>
  ` : '';

  content.innerHTML = `
    <div class="modal-header-meta">
      <span class="repo-badge flagship-badge">${data.badge}</span>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0.3rem 0 0.6rem;">${data.title}</h2>
      <p style="color: var(--primary-cyan); font-weight: 600; font-size: 0.95rem; margin-bottom: 1.2rem;">${data.headline}</p>
    </div>

    <div style="width: 100%; height: 260px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; background: #000;">
      <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.6rem;">Project Overview</h3>
      <p style="color: var(--text-muted); font-size: 0.94rem; line-height: 1.7;">${data.overview}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-rose); margin-bottom: 0.6rem;">
          <i class="fa-solid fa-triangle-exclamation"></i> Engineering Challenges
        </h4>
        <ul style="padding-left: 1.2rem; font-size: 0.86rem; color: var(--text-muted); line-height: 1.6;">
          ${data.challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-emerald); margin-bottom: 0.6rem;">
          <i class="fa-solid fa-circle-check"></i> Implemented Solutions
        </h4>
        <ul style="padding-left: 1.2rem; font-size: 0.86rem; color: var(--text-muted); line-height: 1.6;">
          ${data.solutions.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div style="margin-bottom: 1.8rem;">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem;">Technology Stack</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.8rem; border-top: 1px solid var(--border-subtle); padding-top: 1.2rem;">
      ${figmaBtn}
      ${liveBtn}
      <a href="${data.repoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-md">
        <i class="fa-brands fa-github"></i> View GitHub Repository
      </a>
      <button class="btn btn-outline btn-md" onclick="closeProjectModal()">Close</button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) {
    closeBtn.onclick = closeProjectModal;
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside container
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeProjectModal();
  }
});

/* =============================================================================
   13. BACK TO TOP BUTTON & CURRENT YEAR
   ============================================================================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* =============================================================================
   14. UTILITY HELPERS
   ============================================================================= */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
