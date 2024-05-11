
//spinner
$(document).ready(function () {
  function showLoader() {
    $('#loader').show();
  }

  function hideLoader() {
    $('#loader').hide();
  }

  showLoader();

  loadDataFromDatabase(function () {
    hideLoader();
  });
});

function loadDataFromDatabase(callback) {

  setTimeout(function () {
    callback();
  }, 2000);
}


