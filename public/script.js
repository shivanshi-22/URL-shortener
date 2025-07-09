const form = document.getElementById('url-form');
const result = document.getElementById('result');
const stats = document.getElementById('stats');
const chartEl = document.getElementById('chart');

// Initially hide result sections
result.style.display = 'none';
stats.style.display = 'none';
document.getElementById('qrcode').style.display = 'none';
chartEl.style.display = 'none';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const longUrl = document.getElementById('longUrl').value.trim();
  const customCode = document.getElementById('customCode').value.trim();

  if (!longUrl) {
    result.innerHTML = `<div class="alert alert-warning">Please enter a valid URL.</div>`;
    result.style.display = 'block';
    return;
  }

  const res = await fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl, customCode }),
  });

  const data = await res.json();

  if (res.ok) {
    const shortUrl = data.shortUrl;
    result.innerHTML = `
      <h4>Your Short URL</h4>
      <div class="input-group mb-3">
        <input type="text" id="copyField" class="form-control" value="${shortUrl}" readonly>
        <button class="btn btn-outline-secondary" onclick="copyToClipboard()">Copy</button>
      </div>
      <a href="/stats/${shortUrl.split('/').pop()}" class="btn btn-info">View Analytics</a>
    `;
    result.style.display = 'block';

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, shortUrl);
    qrContainer.style.display = 'block';

    chartEl.style.display = 'block';
    stats.style.display = 'block';

    showStats(shortUrl.split('/').pop());
  } else {
    result.innerHTML = `<div class="alert alert-danger">${data}</div>`;
    result.style.display = 'block';
  }
});

function copyToClipboard() {
  const copyField = document.getElementById('copyField');
  copyField.select();
  copyField.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyField.value)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => alert('Failed to copy!'));
}

async function showStats(code) {
  const res = await fetch(`/stats/${code}`);
  const data = await res.json();

  stats.innerHTML = `
    <p><strong>Original:</strong> ${data.longUrl}</p>
    <p><strong>Created:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
    <p><strong>Total Visits:</strong> ${data.visits.length}</p>
  `;

  const dates = data.visits.map(d => new Date(d).toLocaleDateString());
  const counts = {};
  dates.forEach(date => counts[date] = (counts[date] || 0) + 1);

  const ctx = chartEl.getContext('2d');
  if (window.visitChart) window.visitChart.destroy();
  window.visitChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Visits per Day',
        data: Object.values(counts),
        backgroundColor: '#007bff',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    }
  });
}
