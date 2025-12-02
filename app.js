document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('lang') || 'en';
  let dict = {};

  async function loadLang(lang) {
    try {
      const res = await fetch(`./lang/${lang}.json`, { cache: 'no-store' });
      dict = await res.json();
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });
      localStorage.setItem('lang', lang);
    } catch (e) {
      console.warn('Language load failed', e);
    }
  }

  document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      currentLang = lang;
      loadLang(lang);
    });
  });
  loadLang(currentLang);

  const form = document.getElementById('feedbackForm');
  const status = document.getElementById('status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';

    const message = document.getElementById('message').value.trim();
    if (!message) {
      status.textContent = dict['status_empty'] || 'Please enter a message.';
      status.className = 'error';
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        status.textContent = dict['status_success'] || 'Feedback submitted successfully!';
        status.className = 'success';
        form.reset();
      } else {
        status.textContent = dict['status_error'] || 'Submission failed. Please try again.';
        status.className = 'error';
      }
    } catch (err) {
      console.error(err);
      status.textContent = dict['status_error'] || 'Network error. Please try again later.';
      status.className = 'error';
    }
  });
});
