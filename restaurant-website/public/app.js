document.getElementById('homeBtn').addEventListener('click', function() {
    showSection('home');
  });
  
  document.getElementById('menuBtn').addEventListener('click', function() {
    showSection('menu');
  });
  
  document.getElementById('contactBtn').addEventListener('click', function() {
    showSection('contact');
  });
  
  function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
  
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
  }
  