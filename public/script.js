const form = document.getElementById('url-form');
const result = document.getElementById('result');
const stats = document.getElementById('stats');
const chartEl = document.getElementById('chart');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const longUrl = document.getElementById('longUrl').value;
  const customCode = document.getElementById('customCode').value;

  const res = await fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl, customCode }),
  });

  const data = await res.json();
  result.innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;

  showStats(data.shortUrl.split('/').pop());
});

async function showStats(code) {
  const res = await fetch(`/stats/${code}`);
  const data = await res.json();

  stats.innerHTML = `
    <p><strong>Original:</strong> ${data.longUrl}</p>
    <p><strong>Created:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
    <p><strong>Total Visits:</strong> ${data.visits.length}</p>
  `;

  // Chart
  const dates = data.visits.map(d => new Date(d).toLocaleDateString());
  const counts = {};
  dates.forEach(date => counts[date] = (counts[date] || 0) + 1);

  const ctx = chartEl.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Visits per Day',
        data: Object.values(counts),
        backgroundColor: '#007bff'
      }]
    }
  });
}
