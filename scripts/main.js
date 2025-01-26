document.addEventListener('DOMContentLoaded', () => {
  // Grab all the cells
  const decorationCells = document.querySelectorAll('.decoration-cell');

  decorationCells.forEach(cell => {
    cell.addEventListener('click', () => {
      // Get the path to the PNG from the data-attribute
      const imagePath = cell.getAttribute('data-image');
      
      // Create a hidden <a> element programmatically
      const link = document.createElement('a');
      link.href = imagePath;
      // The downloaded file name => e.g. 'decoration3.png'
      link.download = imagePath.split('/').pop(); 
      
      // Append, click, and remove the link to trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
});
