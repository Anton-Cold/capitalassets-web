document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animated counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

// Charts: load Chart.js and initialize only when the charts section nears the viewport
function renderCharts() {
  Chart.defaults.color = '#c3cddc';
  Chart.defaults.font.family = "'Inter', sans-serif";
  const gold = '#c8a24a';
  const goldLight = '#e4c878';
  const gridColor = 'rgba(255,255,255,0.08)';

  new Chart(document.getElementById('chartLiquidez'), {
    type: 'line',
    data: {
      labels: ['Inicio', 'Mes 1', 'Mes 2', 'Mes 3'],
      datasets: [{
        label: 'Índice de liquidez',
        data: [100, 114, 129, 145],
        borderColor: goldLight,
        backgroundColor: 'rgba(228,200,120,0.18)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: goldLight,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: gridColor }, ticks: { callback: v => v } },
        x: { grid: { display: false } }
      }
    }
  });

  new Chart(document.getElementById('chartAhorros'), {
    type: 'doughnut',
    data: {
      labels: ['Costos financieros', 'Costos administrativos', 'Optimización contractual', 'Otros ahorros'],
      datasets: [{
        data: [35, 25, 22, 18],
        backgroundColor: ['#c8a24a', '#8fa6c9', '#4d6f9e', '#2c4a72'],
        borderColor: '#0b2340',
        borderWidth: 3,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 } } } }
    }
  });

  new Chart(document.getElementById('chartComparativa'), {
    type: 'bar',
    data: {
      labels: ['Flujo de caja', 'Rentabilidad', 'Costos financieros'],
      datasets: [
        { label: 'Antes', data: [100, 100, 100], backgroundColor: 'rgba(143,166,201,0.55)', borderRadius: 6 },
        { label: 'Después', data: [138, 126, 79], backgroundColor: gold, borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 } } } },
      scales: {
        y: { grid: { color: gridColor } },
        x: { grid: { display: false } }
      }
    }
  });

  new Chart(document.getElementById('chartIndustrias'), {
    type: 'polarArea',
    data: {
      labels: ['Inmobiliario / Construcción', 'Transporte y logística', 'Turismo y hotelería', 'Industria y manufactura', 'Tecnología y otros'],
      datasets: [{
        data: [26, 22, 18, 20, 14],
        backgroundColor: ['rgba(200,162,74,0.75)', 'rgba(143,166,201,0.75)', 'rgba(77,111,158,0.75)', 'rgba(44,74,114,0.75)', 'rgba(228,200,120,0.55)']
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 10 } } } },
      scales: { r: { grid: { color: gridColor }, angleLines: { color: gridColor }, ticks: { display: false } } }
    }
  });
}

let chartJsLoading = null;
function loadChartJs() {
  if (chartJsLoading) return chartJsLoading;
  chartJsLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'js/vendor/chart.umd.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return chartJsLoading;
}

const chartsSection = document.querySelector('.charts-grid');
if (chartsSection) {
  const chartsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chartsObserver.unobserve(entry.target);
        loadChartJs().then(renderCharts).catch(() => {});
      }
    });
  }, { rootMargin: '300px 0px' });
  chartsObserver.observe(chartsSection);
}
