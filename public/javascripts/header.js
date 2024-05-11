if (window.location.pathname !== '/profile') {
  document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    const homeLinks = document.querySelectorAll('.home');
    homeLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function changeProfile() {
  document.getElementById("fileInput").click();
}

document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", function() {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const file = this.files[0];
      if (file) {
        const fileName = file.name.toLowerCase();
        const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (!allowedExtensions.includes(extension)) {
          alert("Please select a valid image file.");
          this.value = "";
        } else {
          const uploadForm = document.getElementById("uploadform");
          if (uploadForm) {
            uploadForm.submit();
          }
        }
      }
    });
  }
});

function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`/delete/${postId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert('Post deleted successfully');
        location.reload();
      } else {
        alert('Failed to delete post: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete post');
    });
  }
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.trim().toLowerCase();

  fetch(`/search?q=${searchTerm}`)
    .then(response => response.json())
    .then(results => {
      displayResults(results, searchTerm);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      searchResults.innerHTML = 'Error fetching search results';
      searchResults.style.display = 'block';
    });
});

function displayResults(results, searchTerm) {
  if (searchTerm === '') {
    searchResults.style.display = 'none';
  } else if (results.length === 0) {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
  } else {
    searchResults.style.display = 'block';
    searchResults.innerHTML = '';
    results.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.textContent = result.imageText;
      searchResults.appendChild(resultElement);
    });
  }
}
