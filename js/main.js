/**
 * PRACHI PATEL - B.PHARM SCHOLAR PORTFOLIO
 * Main JavaScript Engine
 * Interactions, Molecular Canvas, Theme Toggle, Calculators, Modals & Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  initMolecularCanvas();
  initThemeToggle();
  initNavigation();
  initMetricsCounter();
  initSkillsTabs();
  initProjectFilters();
  initProjectModal();
  initPharmaCalculators();
  initCertificateModal();
  initResumeModal();
  initContactForm();
  initScrollTop();
});

/* ===================================================================
   1. MOLECULAR CANVAS BACKGROUND
   Renders floating atoms and connecting chemical bonds
   =================================================================== */
function initMolecularCanvas() {
  const canvas = document.getElementById('molecular-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 45);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.5 + 1.5;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(16, 185, 129, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color + '0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting bonds between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 130) * 0.22;
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. THEME TOGGLE (DARK / LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');

  const savedTheme = localStorage.getItem('prachi_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, icon);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('prachi_theme', newTheme);
    updateThemeIcon(newTheme, icon);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });
}

function updateThemeIcon(theme, icon) {
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
}

/* ===================================================================
   3. NAVIGATION & SCROLLSPY
   =================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky Navbar Blur Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy Active Link
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 110;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ===================================================================
   4. METRICS COUNTER ANIMATION
   =================================================================== */
function initMetricsCounter() {
  const metricValues = document.querySelectorAll('.metric-number[data-target]');
  if (!metricValues.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        metricValues.forEach((item) => {
          const target = parseFloat(item.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            item.textContent = isDecimal ? current.toFixed(2) : Math.floor(current) + '+';
          }, stepTime);
        });
      }
    },
    { threshold: 0.3 }
  );

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) observer.observe(metricsSection);
}

/* ===================================================================
   5. SKILLS TABS & ANIMATED PROGRESS BARS
   =================================================================== */
function initSkillsTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  // Trigger skill bar width animation on scroll
  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.skill-fill').forEach((bar) => {
            const width = bar.getAttribute('data-width') || '85%';
            bar.style.width = width;
          });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(skillSection);
  }

  // Filter skills categories
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-skill-filter');
      skillCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-skill-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   6. PROJECT FILTERS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. PROJECT DETAILS MODAL
   =================================================================== */
const projectDatabase = {
  project1: {
    title: 'Formulation and Evaluation of Herbal Nanogel for Topical Drug Delivery',
    category: 'Formulation & NDDS',
    status: 'Completed (Final Year Dissertation)',
    guide: 'Dr. V. K. Shah (Professor & HOD, Pharmaceutics)',
    abstract:
      'This research focuses on overcoming poor epidermal penetration of curcumin and neem extract phytoconstituents through a phytosomal nanogel delivery system. Carbopol 940 was utilized as a polymer matrix with permeation enhancers.',
    methodology: [
      'Phytosome preparation via solvent evaporation with soya lecithin (1:1 molar ratio)',
      'Dispersion into Carbopol gel base (1.0% w/v) with triethanolamine pH adjustment (pH 6.4)',
      'Characterization via Zeta Potential (-28.4 mV) and Particle Size Analysis (142 nm average)',
      'In-Vitro Drug Release using Franz Diffusion Cell across synthetic membrane over 12 hours'
    ],
    instruments: ['Shimadzu UV-1800 Spectrophotometer', 'Brookfield Viscometer', 'Malvern Zetasizer', 'Franz Diffusion Cell'],
    outcomes: 'Achieved 84.6% entrapment efficiency and 2.4-fold higher skin permeation rate compared to conventional topical ointments.',
    publication: 'Submitted to Indian Journal of Pharmaceutical Sciences (Under Peer Review)'
  },
  project2: {
    title: 'Comparative Dissolution Kinetics & Assay of Metformin HCl Brands',
    category: 'Analytical QC & QA',
    status: 'Completed (Industrial Pharmacy Lab)',
    guide: 'Dr. R. M. Trivedi (Dept. of Quality Assurance)',
    abstract:
      'A post-marketing in-vitro bioequivalence study comparing three commercial brands of Metformin Hydrochloride (500mg) against reference standard under simulated gastric and intestinal fluids as per USP guidelines.',
    methodology: [
      'Assay testing via UV Spectrophotometry at 232 nm in phosphate buffer pH 6.8',
      'Dissolution profiling utilizing USP Apparatus II (Paddle) at 50 RPM, 37°C ± 0.5°C',
      'Sampling intervals: 5, 10, 15, 30, 45, and 60 minutes with automated volume replacement',
      'Model-independent mathematical calculation of Similarity Factor (f2) and Difference Factor (f1)'
    ],
    instruments: ['Electrolab 8-Vessel Dissolution Tester', 'Shimadzu HPLC (Prominence)', 'Mettler Toledo Analytical Balance'],
    outcomes: 'All three brands demonstrated similarity factors (f2 > 50) confirming in-vitro therapeutic equivalence and compliance with Indian Pharmacopoeia standards.',
    publication: 'Presented at National Pharmacy Week (NPW) Technical Poster Session'
  },
  project3: {
    title: 'Adverse Drug Reaction (ADR) Monitoring in Geriatric Inpatients',
    category: 'Clinical & Pharmacovigilance',
    status: 'Completed (Hospital Pharmacy Internship)',
    guide: 'Chief Clinical Pharmacist, Sir T. General Hospital & GMC Bhavnagar',
    abstract:
      'An observational prospective study over 3 months analyzing 140 geriatric patient records to identify suspected ADRs, drug-drug interactions, and polypharmacy risks in cardiovascular and diabetic wards.',
    methodology: [
      'Identification and documentation of suspected ADRs using CDSCO Suspected ADR Reporting Forms',
      'Causality assessment using Naranjo Algorithm and WHO-UMC Causality Assessment Scale',
      'Severity categorization using Modified Hartwig and Siegel Severity Scale',
      'Preventability assessment through Schumock and Thornton Criteria'
    ],
    instruments: ['PvPI ADR Formats', 'Lexicomp Drug Interaction Database', 'Medscape Clinical Checker', 'SPSS v25'],
    outcomes: 'Documented 28 suspected ADRs (64% predictable Type A reactions), predominantly gastrointestinal bleeding associated with NSAIDs and hypoglycemic episodes with Sulfonylureas.',
    publication: 'Hospital Internal Clinical Audit Report & PvPI Submission'
  },
  project4: {
    title: 'In-Silico Screening of Phytoconstituents Against Cyclooxygenase-2 (COX-2)',
    category: 'In-Silico & Bioinformatics',
    status: 'Completed (Research Elective)',
    guide: 'Dr. A. K. Joshi (Medicinal Chemistry)',
    abstract:
      'Computer-aided drug design (CADD) study investigating 20 flavonoid phytoconstituents as selective inhibitors of COX-2 (PDB ID: 5IKR) to discover potent anti-inflammatory leads with reduced gastric toxicity.',
    methodology: [
      'Protein preparation and active site grid generation using AutoDock Tools',
      '3D ligand structure drawing in ChemDraw and energy minimization with MMFF94 force field',
      'Molecular docking simulation with AutoDock Vina scoring function',
      'In-silico ADMET and Lipinski Rule of 5 pharmacokinetic profiling using SwissADME'
    ],
    instruments: ['AutoDock Vina', 'PyMOL Molecular Graphics System', 'ChemDraw Ultra', 'SwissADME Server'],
    outcomes: 'Quercetin-3-O-rutinoside exhibited superior binding affinity (-9.2 kcal/mol) compared to Celecoxib (-8.5 kcal/mol) with zero violations of Lipinski rules.',
    publication: 'Drafted Manuscript for Bioorganic & Medicinal Chemistry Letters'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close-btn');
  const projectBtns = document.querySelectorAll('.project-btn[data-project-id]');

  projectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      const data = projectDatabase[id];
      if (!data) return;

      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalProjectCategory').textContent = data.category;
      document.getElementById('modalProjectStatus').textContent = data.status;
      document.getElementById('modalProjectGuide').textContent = data.guide;
      document.getElementById('modalProjectAbstract').textContent = data.abstract;
      document.getElementById('modalProjectOutcomes').textContent = data.outcomes;
      document.getElementById('modalProjectPublication').textContent = data.publication;

      // Render Methodology
      const methList = document.getElementById('modalProjectMethodology');
      methList.innerHTML = '';
      data.methodology.forEach((step) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${step}</span>`;
        methList.appendChild(li);
      });

      // Render Instruments
      const instTags = document.getElementById('modalProjectInstruments');
      instTags.innerHTML = '';
      data.instruments.forEach((inst) => {
        const span = document.createElement('span');
        span.className = 'p-tag';
        span.innerHTML = `<i class="fas fa-microscope"></i> ${inst}`;
        instTags.appendChild(span);
      });

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===================================================================
   8. INTERACTIVE PHARMACEUTICAL CALCULATOR TOOLKIT
   Young's Rule, Clark's Rule, Dilution C1V1 = C2V2
   =================================================================== */
function initPharmaCalculators() {
  const toolTabBtns = document.querySelectorAll('.tool-tab-btn');
  const toolPanels = document.querySelectorAll('.tool-panel');

  toolTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toolTabBtns.forEach((b) => b.classList.remove('active'));
      toolPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const panelId = btn.getAttribute('data-tool-target');
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.add('active');
    });
  });

  // Young's Rule Calculator
  const youngAge = document.getElementById('youngAge');
  const youngAdultDose = document.getElementById('youngAdultDose');
  const youngResult = document.getElementById('youngResult');

  function calculateYoung() {
    if (!youngAge || !youngAdultDose || !youngResult) return;
    const age = parseFloat(youngAge.value) || 0;
    const adultDose = parseFloat(youngAdultDose.value) || 0;

    if (age <= 0 || adultDose <= 0) {
      youngResult.textContent = '0.00 mg';
      return;
    }

    // Formula: [Age / (Age + 12)] * Adult Dose
    const childDose = (age / (age + 12)) * adultDose;
    youngResult.textContent = `${childDose.toFixed(2)} mg`;
  }

  if (youngAge && youngAdultDose) {
    youngAge.addEventListener('input', calculateYoung);
    youngAdultDose.addEventListener('input', calculateYoung);
    calculateYoung();
  }

  // Clark's Rule Calculator
  const clarkWeight = document.getElementById('clarkWeight');
  const clarkAdultDose = document.getElementById('clarkAdultDose');
  const clarkResult = document.getElementById('clarkResult');

  function calculateClark() {
    if (!clarkWeight || !clarkAdultDose || !clarkResult) return;
    const weight = parseFloat(clarkWeight.value) || 0; // in kg
    const adultDose = parseFloat(clarkAdultDose.value) || 0;

    if (weight <= 0 || adultDose <= 0) {
      clarkResult.textContent = '0.00 mg';
      return;
    }

    // Formula: [Weight in kg / 70 kg] * Adult Dose
    const childDose = (weight / 70) * adultDose;
    clarkResult.textContent = `${childDose.toFixed(2)} mg`;
  }

  if (clarkWeight && clarkAdultDose) {
    clarkWeight.addEventListener('input', calculateClark);
    clarkAdultDose.addEventListener('input', calculateClark);
  }

  // Serial Dilution Calculator (C1 * V1 = C2 * V2)
  const dilC1 = document.getElementById('dilC1');
  const dilC2 = document.getElementById('dilC2');
  const dilV2 = document.getElementById('dilV2');
  const dilResult = document.getElementById('dilResult');

  function calculateDilution() {
    if (!dilC1 || !dilC2 || !dilV2 || !dilResult) return;
    const c1 = parseFloat(dilC1.value) || 0;
    const c2 = parseFloat(dilC2.value) || 0;
    const v2 = parseFloat(dilV2.value) || 0;

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
      dilResult.textContent = '0.00 mL';
      return;
    }

    if (c2 > c1) {
      dilResult.textContent = 'Target C2 cannot be higher than Stock C1';
      dilResult.style.fontSize = '1.1rem';
      return;
    }

    dilResult.style.fontSize = '2.5rem';
    // Formula: V1 = (C2 * V2) / C1
    const v1 = (c2 * v2) / c1;
    const solvent = v2 - v1;
    dilResult.textContent = `${v1.toFixed(2)} mL Stock`;
    const subtext = document.getElementById('dilSolventSub');
    if (subtext) subtext.textContent = `+ ${solvent.toFixed(2)} mL Solvent (Water/Buffer)`;
  }

  if (dilC1 && dilC2 && dilV2) {
    dilC1.addEventListener('input', calculateDilution);
    dilC2.addEventListener('input', calculateDilution);
    dilV2.addEventListener('input', calculateDilution);
    calculateDilution();
  }
}

/* ===================================================================
   9. CERTIFICATE VIEWER MODAL
   =================================================================== */
function initCertificateModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close-btn');
  const verifyLinks = document.querySelectorAll('.cert-verify-link');

  verifyLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const title = link.getAttribute('data-cert-title');
      const issuer = link.getAttribute('data-cert-issuer');
      const date = link.getAttribute('data-cert-date');
      const certId = link.getAttribute('data-cert-id');

      document.getElementById('modalCertTitle').textContent = title;
      document.getElementById('modalCertIssuer').textContent = issuer;
      document.getElementById('modalCertDate').textContent = date;
      document.getElementById('modalCertId').textContent = certId;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===================================================================
   10. RESUME / CV VIEWER & PRINT SYSTEM
   =================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (!modal) return;
  const openBtns = document.querySelectorAll('.view-resume-trigger');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const printBtn = document.getElementById('printResumeBtn');

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   11. CONTACT FORM HANDLER & LIVE FEEDBACK
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Inquiry...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();
      showToast(`Thank you, ${name}! Your inquiry has been sent to Prachi Patel.`, 'success');
    }, 1200);
  });
}

/* ===================================================================
   12. TOAST NOTIFICATIONS
   =================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'check-circle';
  let color = 'var(--accent-emerald)';
  if (type === 'error') {
    icon = 'exclamation-circle';
    color = 'var(--accent-rose)';
  } else if (type === 'info') {
    icon = 'info-circle';
    color = 'var(--accent-cyan)';
  }

  toast.style.borderColor = color;
  toast.innerHTML = `<i class="fas fa-${icon}" style="color:${color}; font-size:1.1rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ===================================================================
   13. SCROLL TO TOP BUTTON
   =================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
