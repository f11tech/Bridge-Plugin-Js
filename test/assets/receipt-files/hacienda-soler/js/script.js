document.addEventListener('DOMContentLoaded', () => {
  // Fetch the data from the external JSON file
  fetch('./data/data.json') // Make sure the relative path points correctly to your data.json file
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
    })
    .then((receiptData) => {
      const data = receiptData[0]; // Assuming it's an array and you want the first entry

      // Update HTML elements with JSON data
      document.getElementById('sucursal').textContent = data.sucursal;
      document.getElementById('direccion').textContent = data.direccion;
      document.getElementById('operacion').textContent = data.operacion;

      // Set the current date and time
      const date = new Date();
      const options = { year: 'numeric', month: 'short', day: 'numeric' };

      // Format the date as "Oct/22/2024"
      const [month, day, year] = date.toLocaleDateString('en-US', options).replace(',', '').split(' ');
      const formattedDate = `${month}/${day}/${year}`;

      const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Update the date and time in the relevant elements
      document.getElementById('current-date').textContent = formattedDate;
      document.getElementById('current-time').textContent = formattedTime;
    })
    .catch((error) => {
      console.error('Error fetching the JSON data:', error);
    });
});
