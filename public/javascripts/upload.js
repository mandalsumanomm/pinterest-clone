document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.querySelector('.upload-form');

  uploadForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.location.href = '/feed';
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  });
});
