/**
 * Stackly Municipal Services - Dashboard Analytics & Charts Engine
 * Powers animated counter HUDs, responsive Line Charts, Bar Charts, and Pie/Doughnut Charts.
 * Built with Chart.js v4 + Vanilla JS animations.
 */

// Universal Page History Tracker for 404 "Go Back" Navigation
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

// Global Stackly Theme Palette
const STACKLY_COLORS = {
  orange: '#ff6600',
  orangeLight: 'rgba(255, 102, 0, 0.15)',
  orangeBorder: 'rgba(255, 102, 0, 0.8)',
  slate: '#0f172a',
  slateLight: 'rgba(15, 23, 42, 0.08)',
  emerald: '#10b981',
  emeraldLight: 'rgba(16, 185, 129, 0.15)',
  sky: '#0284c7',
  skyLight: 'rgba(2, 132, 199, 0.15)',
  amber: '#f59e0b',
  amberLight: 'rgba(245, 158, 11, 0.15)',
  purple: '#8b5cf6',
  purpleLight: 'rgba(139, 92, 246, 0.15)',
  rose: '#ef4444',
  roseLight: 'rgba(239, 68, 68, 0.15)',
  grayBorder: '#e2e8f0',
  textMuted: '#64748b',
  textDark: '#0f172a'
};

// Global Chart Defaults
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = STACKLY_COLORS.textMuted;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#f8fafc';
  Chart.defaults.plugins.tooltip.borderColor = '#334155';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.usePointStyle = true;
}

/**
 * Animated Counter HUD logic
 * Animates elements with [data-counter] from 0 to destination number
 */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter')) || 0;
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = parseInt(el.getAttribute('data-duration') || '1400', 10);
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutExpo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = target * easeProgress;

    let formatted = decimals > 0 
      ? currentVal.toFixed(decimals) 
      : Math.floor(currentVal).toLocaleString();

    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      let finalFormatted = decimals > 0 ? target.toFixed(decimals) : Math.floor(target).toLocaleString();
      el.textContent = `${prefix}${finalFormatted}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Chart Builder Utilities
 */
function buildLineChart(canvasId, labels, datasets, yAxisLabel = '') {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || STACKLY_COLORS.orange,
        backgroundColor: ds.bgColor || 'rgba(255, 102, 0, 0.06)',
        borderWidth: 2.5,
        pointBackgroundColor: ds.color || STACKLY_COLORS.orange,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: ds.fill !== undefined ? ds.fill : true,
        tension: 0.38
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
          labels: { boxWidth: 12, usePointStyle: true, font: { weight: 600 } }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { weight: 600 } }
        },
        y: {
          grid: { color: STACKLY_COLORS.grayBorder, strokeDashArray: [4, 4] },
          title: {
            display: !!yAxisLabel,
            text: yAxisLabel,
            color: STACKLY_COLORS.textMuted,
            font: { size: 11, weight: 600 }
          },
          beginAtZero: true
        }
      }
    }
  });
}

function buildBarChart(canvasId, labels, datasets, isHorizontal = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.colors || STACKLY_COLORS.orange,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 38
      }))
    },
    options: {
      indexAxis: isHorizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
          labels: { boxWidth: 12, usePointStyle: true }
        }
      },
      scales: {
        x: {
          grid: { display: isHorizontal, color: STACKLY_COLORS.grayBorder },
          ticks: { font: { weight: 600 } }
        },
        y: {
          grid: { display: !isHorizontal, color: STACKLY_COLORS.grayBorder },
          ticks: { font: { weight: 600 } },
          beginAtZero: true
        }
      }
    }
  });
}

function buildPieChart(canvasId, labels, data, bgColors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColors || [
          STACKLY_COLORS.orange,
          STACKLY_COLORS.slate,
          STACKLY_COLORS.emerald,
          STACKLY_COLORS.sky,
          STACKLY_COLORS.amber,
          STACKLY_COLORS.purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            padding: 14,
            font: { weight: 600 }
          }
        }
      }
    }
  });
}

// Simple filterable table controller
function initTableFilters() {
  document.querySelectorAll('.dashboard-table-toolbar').forEach(toolbar => {
    const chips = toolbar.querySelectorAll('.dashboard-filter-chip');
    const table = toolbar.closest('.dashboard-table-card').querySelector('.dashboard-data-table');
    if (!table) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (!filter || filter === 'all') {
            row.style.display = '';
          } else {
            const status = row.getAttribute('data-status');
            row.style.display = (status === filter) ? '' : 'none';
          }
        });
      });
    });
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initCounterAnimations();
  initTableFilters();
});
