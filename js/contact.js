document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    var resp = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });
    if (resp.ok) {
      document.getElementById('formSuccess').style.display = 'block';
      document.getElementById('formError').style.display = 'none';
      this.reset();
    } else {
      throw new Error('bad response');
    }
  } catch(err) {
    document.getElementById('formError').style.display = 'block';
    document.getElementById('formSuccess').style.display = 'none';
  }
  btn.disabled = false;
  btn.textContent = 'Send Message';
});
