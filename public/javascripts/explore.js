function updateDate() {
  const currentDateElement = document.getElementById("currentDate");
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  currentDateElement.textContent = formattedDate;
}

updateDate();

setInterval(updateDate, 1000);
