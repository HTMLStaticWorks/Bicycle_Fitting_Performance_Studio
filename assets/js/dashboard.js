/**
 * VELOMETRIC™ - Rider Dashboard Engine
 * Handles sub-module routing, interactive Chart.js telemetry, appointment management,
 * fit measurement history, and session handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardRouting();
  initDashboardCharts();
  initBookingModule();
  initInvoiceModal();
  initGarageManager();
  initLogout();
});

/* --------------------------------------------------------------------------
   1. Dashboard Sub-Module Navigation
   -------------------------------------------------------------------------- */
function initDashboardRouting() {
  const navBtns = document.querySelectorAll('.dash-nav-btn[data-dash-target]');
  const panels = document.querySelectorAll('.dash-panel');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.dashTarget;

      navBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      panels.forEach(p => {
        p.classList.remove('is-active');
        if (p.id === target) {
          p.classList.add('is-active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Telemetry Charts (Fit History & CdA Aerodynamics)
   -------------------------------------------------------------------------- */
let fitChartInstance = null;
let cdaChartInstance = null;

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Fit Measurement History Timeline
  const fitCtx = document.getElementById('fitHistoryChart');
  if (fitCtx) {
    fitChartInstance = new Chart(fitCtx, {
      type: 'line',
      data: {
        labels: ['Jan 2025 (Initial)', 'May 2025 (Follow-up)', 'Oct 2025 (Mid-Season)', 'Mar 2026 (Aero Refine)', 'Sep 2026 (Current)'],
        datasets: [
          {
            label: 'Saddle Height (mm)',
            data: [738, 742, 745, 747, 748],
            borderColor: '#FF5A1F',
            backgroundColor: 'rgba(255, 90, 31, 0.1)',
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#FF5A1F',
            pointRadius: 5
          },
          {
            label: 'Cockpit Reach (mm)',
            data: [382, 385, 388, 390, 392],
            borderColor: '#00D9C0',
            backgroundColor: 'rgba(0, 217, 192, 0.05)',
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#00D9C0',
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9CA3AF', font: { family: 'Inter', weight: 600 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#9CA3AF' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#9CA3AF' }
          }
        }
      }
    });
  }

  // Chart 2: CdA Aerodynamic Drag vs Velocity
  const cdaCtx = document.getElementById('cdaPerformanceChart');
  if (cdaCtx) {
    cdaChartInstance = new Chart(cdaCtx, {
      type: 'bar',
      data: {
        labels: ['Hoods (Baseline)', 'Drops (Standard)', 'Aero Hoods (Optimized)', 'TT Cockpit Tuck'],
        datasets: [{
          label: 'Aerodynamic Drag Area CdA (m²)',
          data: [0.298, 0.264, 0.228, 0.198],
          backgroundColor: [
            'rgba(255, 255, 255, 0.2)',
            'rgba(201, 205, 211, 0.4)',
            '#00D9C0',
            '#FF5A1F'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' }
          },
          y: {
            min: 0.15,
            max: 0.35,
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#9CA3AF' }
          }
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Live Booking Module
   -------------------------------------------------------------------------- */
function initBookingModule() {
  const form = document.getElementById('dashboard-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = form.querySelector('#book-service').value;
    const date = form.querySelector('#book-date').value;
    const fitter = form.querySelector('#book-fitter').value;

    if (!date) {
      alert('Please select a preferred session date.');
      return;
    }

    // Append to appointment list visually
    const apptTable = document.querySelector('#appointments-table-body');
    if (apptTable) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><strong>${service}</strong></td>
        <td>${date}</td>
        <td>${fitter}</td>
        <td><span class="badge-status status-confirmed">Confirmed</span></td>
        <td><button class="btn btn-sm btn-secondary" onclick="this.closest('tr').remove()">Cancel</button></td>
      `;
      apptTable.prepend(newRow);
    }

    if (window.showToast) {
      window.showToast(`Session reserved: ${service} on ${date} with ${fitter}!`);
    } else {
      alert(`Session confirmed for ${date}!`);
    }

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   4. Receipt / Invoice Modal Simulation
   -------------------------------------------------------------------------- */
function initInvoiceModal() {
  window.viewInvoice = function(invId, amount, service) {
    alert(`INVOICE RECEIPT\n--------------------------------\nInvoice ID: ${invId}\nService: ${service}\nAmount: ${amount}\nStatus: PAID (Stripe/Card)\nTax ID: VELO-EU-94819\nLaboratory: VELOMETRIC Performance Studio Bay 2`);
  };
}

/* --------------------------------------------------------------------------
   5. Bike Garage Manager
   -------------------------------------------------------------------------- */
function initGarageManager() {
  const addBikeBtn = document.getElementById('add-bike-btn');
  const bikeList = document.getElementById('bike-garage-list');

  if (addBikeBtn && bikeList) {
    addBikeBtn.addEventListener('click', () => {
      const bikeName = prompt('Enter Bike Model (e.g., Pinarello Dogma F / Trek Madone):', 'Pinarello Dogma F');
      if (bikeName) {
        const div = document.createElement('div');
        div.className = 'stat-card';
        div.style.marginTop = '16px';
        div.innerHTML = `
          <div class="stat-header">
            <span class="stat-title">Discipline: Road Aero</span>
            <span class="badge-status status-completed">Active Fit</span>
          </div>
          <div class="stat-num" style="font-size: 1.25rem;">${bikeName}</div>
          <p style="font-size: 0.8125rem; color: var(--text-secondary);">Saddle: Specialized Power Pro Mirror 143mm | Cranks: 170mm</p>
        `;
        bikeList.appendChild(div);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Session Logout
   -------------------------------------------------------------------------- */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.btn-logout');

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('velometric_auth');
      window.location.href = 'login.html';
    });
  });
}
