// backend/static/app.js
const form = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultEl.style.display = 'none';
  resultEl.innerHTML = '';
  statusEl.textContent = 'Uploading and scoring… this may take a minute for transcription.';

  const formData = new FormData(form);

  try {
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Server error');
    }

    statusEl.textContent = '';
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div><strong>Default Score:</strong> ${data.score}</div>
      <div style="margin-top:6px"><strong>Explanation:</strong><br/>${data.explanation}</div>
      <div class="muted" style="margin-top:6px">Duration: ${data.duration_minutes} min</div>
    `;
  } catch (err) {
    statusEl.textContent = '';
    resultEl.style.display = 'block';
    resultEl.innerHTML = `<div class="error">⚠️ ${err.message}</div>`;
  }
});